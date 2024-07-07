import React from "react";
import ReactPlayer from "react-player";
import he from "he";

type SecureEmbedMediaProps = {
  url_overridden_by_dest?: string;
  content?: string;
  media_domain_url?: string;
  width: number;
  height: number;
};

const SecureMediaEmbed: React.FC<SecureEmbedMediaProps> = ({
  content,
  media_domain_url,
  url_overridden_by_dest,
  width,
  height,
}) => {
  const decodedContent = content ? he.decode(content) : null;

  return (
    <div className="my-4 flex justify-center items-center max-w-full max-h-[70vh]">
      {url_overridden_by_dest || media_domain_url ? (
        <div
          className="relative w-full"
          style={{
            paddingTop: `${(height / width) * 100}%`,
          }}
        >
          <div className="absolute inset-0 flex justify-center items-center">
            <ReactPlayer
              url={url_overridden_by_dest ?? media_domain_url}
              controls
              width="100%"
              height="100%"
              playing
              muted
            />
          </div>
        </div>
      ) : (
        decodedContent && (
          <div
            className="flex justify-center items-center"
            dangerouslySetInnerHTML={{ __html: decodedContent }}
          />
        )
      )}
    </div>
  );
};

export default SecureMediaEmbed;
