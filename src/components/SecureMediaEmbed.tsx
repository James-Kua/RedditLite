import React from "react";
import ReactPlayer from "react-player";

type SecureEmbedMediaProps = {
  media_domain_url: string;
  width: number;
  height: number;
};

const SecureMediaEmbed: React.FC<SecureEmbedMediaProps> = ({
  media_domain_url,
  width,
  height,
}) => {
  return (
    <div
      className="mt-4 flex justify-center items-center max-w-full max-h-[70vh]"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <ReactPlayer
        url={media_domain_url}
        controls
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default SecureMediaEmbed;
