import React from "react";
import ReactPlayer from "react-player";

type SecureMediaProps = {
  reddit_video: {
    hls_url: string;
    fallback_url: string;
    width: number;
    height: number;
  };
};

const SecureMedia: React.FC<SecureMediaProps> = ({ reddit_video }) => {
  const { hls_url, fallback_url, width, height } = reddit_video;
  return (
    <div
      className="mt-4 flex justify-center items-center max-w-full max-h-[70vh]"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <ReactPlayer
        url={hls_url ?? fallback_url}
        controls
        width="100%"
        height="100%"
        playing
        muted
      />
    </div>
  );
};

export default SecureMedia;
