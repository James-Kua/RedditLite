import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import he from "he";

type SecureMediaEmbedProps = {
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
  const containerRef = useRef<HTMLDivElement>(null);

  const extractYouTubeUrl = (htmlContent: string): string | null => {
    const div = document.createElement("div");
    div.innerHTML = he.decode(htmlContent);
    const iframe = div.querySelector("iframe");
    return iframe ? iframe.src : null;
  };

  const youtubeUrl = content ? extractYouTubeUrl(content) : null;

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

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center items-center w-full max-w-full mx-auto relative border rounded-sm"
      style={{ paddingTop: `${(height / width) * 100}%` }}
    >
      {isVisible && (
        <div className="absolute inset-0 flex justify-center items-center w-full h-full">
          <ReactPlayer
            url={youtubeUrl ?? url_overridden_by_dest ?? media_domain_url}
            controls
            width="100%"
            height="100%"
            playing={playing}
            muted
          />
        </div>
      )}
    </div>
  );
};

export default SecureMediaEmbed;
