import CustomTag from "./CustomTag";

type ThumbnailProps = {
  thumbnail: string;
};

const Thumbnail: React.FC<ThumbnailProps> = ({ thumbnail }) => {
  if (!thumbnail) return null;

  if (
    thumbnail === "self" ||
    thumbnail === "default" ||
    thumbnail === "spoiler" ||
    thumbnail === ""
  ) {
    return null;
  }

  if (thumbnail === "nsfw") {
    return (
      <CustomTag
        fontSize="text-xs"
        color="text-white"
        backgroundColor="bg-red-500"
        content="🔞 NSFW"
      />
    );
  }

  return (
    <img
      src={thumbnail}
      alt="thumbnail"
      className="relative rounded-md overflow-hidden xs:w-[184px] w-[284px] block mt-2"
    />
  );
};

export default Thumbnail;
