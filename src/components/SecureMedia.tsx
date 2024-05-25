import React from "react";

type SecureMediaProps = {
  reddit_video: {
    fallback_url: string;
    width: number;
    height: number;
  };
};

const SecureMedia: React.FC<SecureMediaProps> = ({ reddit_video }) => {
  const { fallback_url, width, height } = reddit_video;
  return (
    <div
      className="mt-4 aspect-auto flex justify-center items-center max-w-full"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <iframe
        src={fallback_url}
        allowFullScreen
        className="w-full h-full aspect-auto"
      ></iframe>
    </div>
  );
};

export default SecureMedia;
