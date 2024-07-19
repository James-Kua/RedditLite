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
    <div className="mt-4 flex justify-center items-center max-w-full max-h-[500px] mx-auto border rounded-sm">
      <div className="relative max-h-full">
        <img
          src={imageUrl}
          className="rounded-md overflow-hidden w-96 max-w-full max-h-full"
          alt="Image"
        />
      </div>
    </div>
  );
};

export default MediaMetadata;
