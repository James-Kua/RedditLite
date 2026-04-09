import he from "he";
import { useEffect, useRef, useState } from "react";
import { parseInlineImagesFromHtml } from "../utils/parser";

export type BodyHtmlProps = {
  body_html: string;
};

type LinkPreviewData = {
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  url?: string;
};

const BodyHtml: React.FC<BodyHtmlProps> = ({ body_html }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const previewCacheRef = useRef<Map<string, LinkPreviewData>>(new Map());
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const decodedBodyHtml = he.decode(body_html.replace(/\n\n/g, "<br>"));
  const modifiedHtml = parseInlineImagesFromHtml(decodedBodyHtml);

  useEffect(() => {
    if (!contentRef.current) return;

    let activeUrl: string | null = null;

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      const href = link?.getAttribute("href");
      if (!href) return;

      const resolvedUrl = new URL(href, window.location.origin).toString();
      activeUrl = resolvedUrl;
      setHoveredUrl(resolvedUrl);
      setPreviewPosition({ x: event.clientX, y: event.clientY });

      const cachedPreview = previewCacheRef.current.get(resolvedUrl);
      if (cachedPreview) {
        setPreviewData(cachedPreview);
        return;
      }

      setPreviewData(null);

      fetch(`https://metafy-sigma.vercel.app/api?url=${encodeURIComponent(resolvedUrl)}`)
        .then((response) => response.json())
        .then((data: LinkPreviewData) => {
          previewCacheRef.current.set(resolvedUrl, data);
          if (activeUrl === resolvedUrl) {
            setPreviewData(data);
          }
        })
        .catch(() => {
          if (activeUrl === resolvedUrl) {
            setPreviewData({});
          }
        });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!activeUrl) return;
      setPreviewPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const leavingLink = target.closest("a");
      const relatedTarget = event.relatedTarget;
      if (relatedTarget instanceof Node && leavingLink?.contains(relatedTarget)) {
        return;
      }

      activeUrl = null;
      setHoveredUrl(null);
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
  }, [modifiedHtml]);

  const previewImage = previewData?.image || previewData?.logo;
  const previewTitle = previewData?.title || (hoveredUrl ? new URL(hoveredUrl).hostname : "");
  const previewDescription = previewData?.description || hoveredUrl;

  return (
    <div className="relative">
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{
          __html: he.decode(modifiedHtml),
        }}
        className="rich-text-content mt-2 overflow-scroll text-gray-800 text-sm lg:text-md dark:text-zinc-200 leading-normal"
      />
      {hoveredUrl && (
        <div
          className="pointer-events-none fixed z-50 hidden w-72 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur-sm md:block dark:border-slate-700 dark:bg-slate-900/95"
          style={{
            left: Math.min(previewPosition.x + 16, window.innerWidth - 304),
            top: Math.max(previewPosition.y + 16, 12),
          }}
        >
          {previewImage && (
            <img
              src={previewImage}
              alt={previewTitle}
              className="mb-3 h-32 w-full rounded-lg object-contain bg-slate-100 dark:bg-slate-800"
            />
          )}
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{previewTitle}</div>
          <div className="mt-1 line-clamp-3 text-xs text-gray-600 dark:text-gray-300 break-words">
            {previewDescription}
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyHtml;
