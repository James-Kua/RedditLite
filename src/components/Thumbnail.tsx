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
      className="mt-4 max-w-full max-h-[500px] mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-lg"
    />
  );
};

export default Thumbnail;
