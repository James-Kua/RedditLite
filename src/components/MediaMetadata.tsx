import { parseImageType } from "../utils/parser";

type MediaMetadataProps = {
  media_metadata?: any[];
};

const MediaMetadata: React.FC<MediaMetadataProps> = ({ media_metadata }) => {
  if (!media_metadata || media_metadata.length === 0) {
    return null;
  }

  const imageType = parseImageType(
    media_metadata[Object.keys(media_metadata)[0] as unknown as number]?.m
  );
  const imageUrl = `https://i.redd.it/${
    Object.keys(media_metadata)[0]
  }.${imageType}`;

  return (
    <div>
      <div className="relative mt-2">
        <img
          src={imageUrl}
          className="relative rounded-md overflow-hidden xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
          alt="Image"
        />
      </div>
    </div>
  );
};

export default MediaMetadata;
