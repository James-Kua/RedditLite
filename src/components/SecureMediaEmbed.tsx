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

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center items-center w-full max-w-full max-h-[500px] mx-auto relative border rounded-sm"
      style={{ paddingTop: `${aspectRatio}%` }}
    >
      {isVisible && (
        <>
          {url_overridden_by_dest || media_domain_url ? (
            <div className="absolute inset-0 flex justify-center items-center w-full h-full">
              <ReactPlayer
                url={url_overridden_by_dest ?? media_domain_url}
                controls
                width="100%"
                height="100%"
                playing={playing}
                muted
              />
            </div>
          ) : (
            decodedContent && (
              <div
                className="flex justify-center items-center w-full h-full"
                dangerouslySetInnerHTML={{ __html: decodedContent }}
              />
            )
          )}
        </>
      )}
    </div>
  );
};

export default SecureMediaEmbed;
