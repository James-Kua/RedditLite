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
      className="mt-4 flex justify-center items-center max-w-full max-h-[500px] mx-auto border rounded-sm p-2 object-contain"
    />
  );
};

export default Thumbnail;
