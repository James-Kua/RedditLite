import { parseImageType } from "../utils/parser";

type MediaMetadataProps = {
  mediaMetadata?: any[];
};

const MediaMetadata: React.FC<MediaMetadataProps> = ({ mediaMetadata }) => {
  if (!mediaMetadata || mediaMetadata.length === 0) {
    return null;
  }

  const firstMetadata = mediaMetadata[0];
  const m = firstMetadata?.m || "";

  const imageType = parseImageType(m);
  const imageUrl = `https://i.redd.it/${firstMetadata}/${imageType}`;

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
