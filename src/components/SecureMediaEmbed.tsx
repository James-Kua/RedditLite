import React from "react";

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
      className="mt-4 aspect-auto flex justify-center items-center max-w-full"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <iframe
        src={media_domain_url}
        allowFullScreen
        className="w-full h-full aspect-auto"
      ></iframe>
    </div>
  );
};

export default SecureMediaEmbed;
