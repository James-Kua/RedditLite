import React from "react";
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
  const decodedContent = content ? he.decode(content) : null;
  const aspectRatio = Math.min((height / width) * 100, 90);

  return (
    <div
      className="my-4 flex justify-center items-center w-full max-w-[90vw] max-h-[70vh] relative"
      style={{ paddingTop: `${aspectRatio}%` }}
    >
      {url_overridden_by_dest || media_domain_url ? (
        <div className="absolute inset-0 flex justify-center items-center w-full max-h-[90vh]">
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
            className="flex justify-center items-center"
            dangerouslySetInnerHTML={{ __html: decodedContent }}
          />
        )
      )}
    </div>
  );
};

export default SecureMediaEmbed;
