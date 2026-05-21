import { useEffect, useRef, useState, type ReactNode } from "react";

type LinkPreviewData = {
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  url?: string;
};

type HoveredLink = {
  key: string;
  fetchUrl?: string;
  title: string;
  subtitle: string;
  description: string;
  label: string;
  image?: string;
  canFetchPreview: boolean;
};

export type HoveredLinkPreviewProps = {
  children: ReactNode;
  className?: string;
  previewApiUrl?: string;
};

const IMAGE_URL_PATTERN = /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i;
const UNSAFE_PROTOCOL_PATTERN = /^(?:javascript|data|vbscript):/i;
const PREVIEW_WIDTH = 352;
const PREVIEW_HEIGHT = 320;
const DEFAULT_PREVIEW_API_URL = "https://metafy-sigma.vercel.app/api";

function getHostnameLabel(hostname: string) {
  return hostname.replace(/^www\./, "");
}

function truncateMiddle(value: string, maxLength = 96) {
  if (value.length <= maxLength) return value;

  const keep = Math.floor((maxLength - 1) / 2);
  return `${value.slice(0, keep)}...${value.slice(-keep)}`;
}

function safeDecodeUriComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getPreviewSubtitle(previewUrl?: string, fallback?: string) {
  if (!previewUrl) return fallback;

  try {
    return getHostnameLabel(new URL(previewUrl).hostname);
  } catch {
    return fallback;
  }
}

function getRedditLabel(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const [type, name] = parts;

  if (!type || !name) return null;
  if (type.toLowerCase() === "r") return `r/${name}`;
  if (type.toLowerCase() === "u" || type.toLowerCase() === "user") return `u/${name}`;
  if (type.toLowerCase() === "comments") return "Reddit post";

  return null;
}

function getInitials(label: string) {
  const words = label.replace(/[^a-z0-9 ]/gi, " ").split(/\s+/).filter(Boolean);
  return (words[0]?.[0] || "l").toLowerCase();
}

function getProtocolLabel(protocol: string) {
  const protocolName = protocol.replace(":", "");
  return protocolName ? `${protocolName} link` : "Link";
}

function clampPreviewPosition(x: number, y: number) {
  if (typeof window === "undefined") {
    return { x, y };
  }

  return {
    x: Math.min(Math.max(x + 14, 12), Math.max(window.innerWidth - PREVIEW_WIDTH - 12, 12)),
    y: Math.min(Math.max(y + 14, 12), Math.max(window.innerHeight - PREVIEW_HEIGHT - 12, 12)),
  };
}

function normalizeHoveredLink(href: string): HoveredLink | null {
  const trimmedHref = href.trim();

  if (!trimmedHref || UNSAFE_PROTOCOL_PATTERN.test(trimmedHref)) {
    return null;
  }

  if (trimmedHref.startsWith("#")) {
    return {
      key: trimmedHref,
      title: "Page anchor",
      subtitle: trimmedHref,
      description: "Jump within this post",
      label: "Anchor link",
      canFetchPreview: false,
    };
  }

  if (/^mailto:/i.test(trimmedHref)) {
    const email = trimmedHref.replace(/^mailto:/i, "").split("?")[0];

    return {
      key: trimmedHref,
      title: email || "Email link",
      subtitle: "Email address",
      description: trimmedHref,
      label: "Email link",
      canFetchPreview: false,
    };
  }

  if (/^tel:/i.test(trimmedHref)) {
    const phoneNumber = trimmedHref.replace(/^tel:/i, "");

    return {
      key: trimmedHref,
      title: phoneNumber || "Phone link",
      subtitle: "Phone number",
      description: trimmedHref,
      label: "Phone link",
      canFetchPreview: false,
    };
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedHref, window.location.origin);
  } catch {
    return {
      key: trimmedHref,
      title: "Link",
      subtitle: "Unrecognized URL",
      description: trimmedHref,
      label: "Text link",
      canFetchPreview: false,
    };
  }

  const isHttpUrl = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  const isSameOrigin = parsedUrl.origin === window.location.origin;
  const isRelativeHref = trimmedHref.startsWith("/") && !trimmedHref.startsWith("//");
  const redditLabel = getRedditLabel(parsedUrl.pathname);
  const hostname = getHostnameLabel(parsedUrl.hostname);
  const pathname = safeDecodeUriComponent(parsedUrl.pathname || "/");
  const displayUrl = isRelativeHref
    ? `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
    : truncateMiddle(parsedUrl.toString().replace(/\/$/, ""));
  const isImageLink = IMAGE_URL_PATTERN.test(parsedUrl.pathname) || IMAGE_URL_PATTERN.test(trimmedHref);

  if (!isHttpUrl) {
    return {
      key: parsedUrl.toString(),
      title: getProtocolLabel(parsedUrl.protocol),
      subtitle: displayUrl,
      description: parsedUrl.toString(),
      label: getProtocolLabel(parsedUrl.protocol),
      canFetchPreview: false,
    };
  }

  return {
    key: parsedUrl.toString(),
    fetchUrl: isSameOrigin || isRelativeHref ? undefined : parsedUrl.toString(),
    title: redditLabel || hostname || "Link",
    subtitle: isRelativeHref ? "Reddit Lite" : hostname,
    description: isRelativeHref || redditLabel ? pathname : parsedUrl.toString(),
    label: isImageLink ? "Image link" : redditLabel ? "Reddit link" : isSameOrigin ? "Internal link" : "External link",
    image: isImageLink ? parsedUrl.toString() : undefined,
    canFetchPreview: Boolean(!isImageLink && !isSameOrigin && !isRelativeHref),
  };
}

const HoveredLinkPreview = ({
  children,
  className,
  previewApiUrl = DEFAULT_PREVIEW_API_URL,
}: HoveredLinkPreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const previewCacheRef = useRef<Map<string, LinkPreviewData>>(new Map());
  const [hoveredLink, setHoveredLink] = useState<HoveredLink | null>(null);
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hoveredLink) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [hoveredLink]);

  useEffect(() => {
    if (!contentRef.current) return;

    let activeKey: string | null = null;

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      const href = link?.getAttribute("href");
      if (!href) return;

      const normalizedLink = normalizeHoveredLink(href);
      if (!normalizedLink) return;

      activeKey = normalizedLink.key;
      setHoveredLink(normalizedLink);
      setPreviewPosition(clampPreviewPosition(event.clientX, event.clientY));

      if (!normalizedLink.canFetchPreview || !normalizedLink.fetchUrl) {
        setPreviewData(null);
        return;
      }

      const cachedPreview = previewCacheRef.current.get(normalizedLink.fetchUrl);
      if (cachedPreview) {
        setPreviewData(cachedPreview);
        return;
      }

      setPreviewData(null);

      fetch(`${previewApiUrl}?url=${encodeURIComponent(normalizedLink.fetchUrl)}`)
        .then((response) => response.json())
        .then((data: LinkPreviewData) => {
          previewCacheRef.current.set(normalizedLink.fetchUrl as string, data);
          if (activeKey === normalizedLink.key) {
            setPreviewData(data);
          }
        })
        .catch(() => {
          if (activeKey === normalizedLink.key) {
            setPreviewData({});
          }
        });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!activeKey) return;
      setPreviewPosition(clampPreviewPosition(event.clientX, event.clientY));
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const leavingLink = target.closest("a");
      const relatedTarget = event.relatedTarget;
      if (relatedTarget instanceof Node && leavingLink?.contains(relatedTarget)) {
        return;
      }

      activeKey = null;
      setHoveredLink(null);
      setPreviewData(null);
    };

    const container = contentRef.current;
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseout", handleMouseOut);

    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseout", handleMouseOut);
    };
  }, [previewApiUrl]);

  const isPreviewLoading = Boolean(hoveredLink?.canFetchPreview && previewData === null);
  const previewImage = previewData?.image || previewData?.logo || hoveredLink?.image;
  const previewTitle = previewData?.title || hoveredLink?.title || "";
  const previewDescription =
    previewData?.description || (!hoveredLink?.canFetchPreview ? hoveredLink?.description : "");
  const previewSubtitle = getPreviewSubtitle(previewData?.url, hoveredLink?.subtitle);
  const previewSource = previewSubtitle || hoveredLink?.title;
  const previewInitial = getInitials(previewTitle || hoveredLink?.label || "Link");

  return (
    <div className="relative">
      <div ref={contentRef} className={className}>
        {children}
      </div>

      {hoveredLink && (
        <div
          className={`pointer-events-none fixed z-50 hidden w-88 overflow-hidden rounded-2xl border bg-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-200 md:block dark:bg-zinc-950/90 dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] ${
            isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-2"
          } ${
            isPreviewLoading
              ? "border-slate-200/50 dark:border-white/5"
              : "border-slate-200/60 dark:border-white/10"
          }`}
          style={{
            left: previewPosition.x,
            top: previewPosition.y,
          }}
        >
          {isPreviewLoading ? (
            <div className="animate-pulse">
              <div className="h-32 w-full bg-slate-200/50 dark:bg-zinc-800/50" />
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-slate-200/50 dark:bg-zinc-800/50" />
                  <div className="h-3 w-24 rounded bg-slate-200/50 dark:bg-zinc-800/50" />
                </div>
                <div className="h-4 w-full rounded bg-slate-200/50 dark:bg-zinc-800/50" />
                <div className="h-4 w-2/3 rounded bg-slate-200/50 dark:bg-zinc-800/50" />
                <div className="pt-2">
                  <div className="h-2 w-full rounded bg-slate-200/50 dark:bg-zinc-800/50" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {previewImage && (
                <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
                  <img
                    src={previewImage}
                    alt={previewTitle}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2.5 pb-3">
                  {!previewImage && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-[10px] font-bold uppercase tracking-wider text-blue-600 ring-1 ring-blue-500/20 dark:from-blue-400/10 dark:to-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20">
                      {previewInitial}
                    </div>
                  )}
                  {previewSource && (
                    <div className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-zinc-400">
                      {previewSource}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="line-clamp-3 text-[13px] font-semibold leading-snug tracking-tight text-slate-950 dark:text-white">
                    {previewTitle}
                  </h3>

                  {previewDescription && (
                    <p className="line-clamp-5 text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400">
                      {previewDescription}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HoveredLinkPreview;
