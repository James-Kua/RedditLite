import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";

export type SecureMediaProps = {
  reddit_video: {
    hls_url?: string;
    fallback_url: string;
    width: number;
    height: number;
  };
  playing?: boolean;
};

const SecureMedia: React.FC<SecureMediaProps> = ({
  reddit_video,
  playing = false,
}) => {
  const { hls_url, fallback_url, width, height } = reddit_video;
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <div
      ref={containerRef}
      className="mt-4 flex justify-center items-center max-w-full max-h-[500px] mx-auto border rounded-sm"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {isVisible && (
        <ReactPlayer
          src={hls_url || fallback_url}
          controls
          width="100%"
          height="100%"
          playing={playing}
          style={{
            border: "1px solid #e0e0e0"
          }}
          muted
          onClick={handlePlayerClick}
        />
      )}
    </div>
  );
};

export default SecureMedia;
