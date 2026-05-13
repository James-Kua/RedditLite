import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import he from "he";
import { XEmbed, FacebookEmbed, PinterestEmbed, TikTokEmbed, InstagramEmbed } from "react-social-media-embed";
import { TwitchClip } from "react-twitch-embed";

export type SecureMediaEmbedProps = {
  url_overridden_by_dest?: string;
  content?: string;
  media_domain_url?: string;
  width: number;
  height: number;
  playing?: boolean;
};

const SecureMediaEmbed: React.FC<SecureMediaEmbedProps> = ({
  content,
  media_domain_url,
  url_overridden_by_dest,
  width,
  height,
  playing = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const decodedContent = content ? he.decode(content) : null;
  const aspectRatio = Math.min((height / width) * 100, 90);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handlePlayerClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const isTwitterUrl = (url: string) => url.includes("twitter.com");
  const isFacebookUrl = (url: string) => url.includes("facebook.com");
  const isPinterestUrl = (url: string) => url.includes("pinterest.com");
  const isTikTokUrl = (url: string) => url.includes("tiktok.com");
  const isInstagramUrl = (url: string) => url.includes("instagram.com");
  const isTwitchUrl = (url: string) => url.includes("clips.twitch.tv/");
  const hasIframeContent = (html: string) => html.includes("<iframe");

  const getTwitchClipId = (url: string) => {
    const match = url.match(/clips\.twitch\.tv\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const renderIframe = (src: string, title: string) => (
    <div className="absolute inset-0 flex justify-center items-center w-full h-full">
      <iframe
        src={src}
        title={title}
        className="w-full h-full border-0"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture;"
        allowFullScreen
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center items-center w-full max-w-full max-h-[500px] mx-auto relative bg-neutral-900 rounded-lg overflow-hidden"
      style={{ paddingTop: `${aspectRatio}%` }}
    >
      {isVisible &&
        (url_overridden_by_dest ? (
          isTwitterUrl(url_overridden_by_dest) ? (
            <div className="absolute inset-0 flex justify-center items-center w-full h-full">
              <div className="w-full max-w-full max-h-full overflow-auto flex justify-center items-start">
                <XEmbed url={url_overridden_by_dest} className="py-2" />
              </div>
            </div>
          ) : isFacebookUrl(url_overridden_by_dest) ? (
            <div className="absolute inset-0 flex justify-center items-center w-full h-full overflow-auto">
              <FacebookEmbed url={url_overridden_by_dest} />
            </div>
          ) : isPinterestUrl(url_overridden_by_dest) ? (
            <div className="absolute inset-0 flex justify-center items-center w-full h-full overflow-auto">
              <PinterestEmbed url={url_overridden_by_dest} />
            </div>
          ) : isTikTokUrl(url_overridden_by_dest) ? (
            <div className="absolute inset-0 flex justify-center items-center w-full h-full overflow-auto">
              <TikTokEmbed url={url_overridden_by_dest} />
            </div>
          ) : isInstagramUrl(url_overridden_by_dest) ? (
            <div className="absolute inset-0 flex justify-center items-center w-full h-full overflow-auto">
              <InstagramEmbed url={url_overridden_by_dest} />
            </div>
          ) : isTwitchUrl(url_overridden_by_dest) ? (
            <div className="absolute inset-0 flex justify-center items-center w-full h-full overflow-auto">
              <TwitchClip clip={getTwitchClipId(url_overridden_by_dest) || ""} autoplay={false} muted />
            </div>
          ) : decodedContent && hasIframeContent(decodedContent) ? (
            <div
              className="absolute inset-0 w-full h-full overflow-hidden [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
              dangerouslySetInnerHTML={{ __html: decodedContent }}
            />
          ) : media_domain_url ? (
            renderIframe(media_domain_url, "Reddit media embed")
          ) : (
            <div className="absolute inset-0 flex justify-center items-center w-full h-full">
              <ReactPlayer
                src={url_overridden_by_dest}
                controls
                width="100%"
                height="100%"
                playing={playing}
                muted
                onClick={handlePlayerClick}
              />
            </div>
          )
        ) : decodedContent ? (
          <div
            className="absolute inset-0 flex justify-center items-center w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
            dangerouslySetInnerHTML={{ __html: decodedContent }}
          />
        ) : null)}
    </div>
  );
};

export default SecureMediaEmbed;
