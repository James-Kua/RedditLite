import React from "react";
import { Post } from "../types/post";
import he from "he";

export type PostPreviewProps = Pick<Post, "preview">;

const PostPreview: React.FC<PostPreviewProps> = ({ preview }) => {
  if (!preview || !preview.images || preview.images.length === 0) return null;

  const image = preview.images[0];
  const isGif = image.variants && image.variants.gif;

  let imageUrl = "";
  if (isGif && image.variants && image.variants.gif && image.variants.gif.source) {
    imageUrl = image.variants.gif.source.url;
  } else {
    imageUrl = image.source.url;
  }

  return (
    <div className="relative mt-2 flex justify-center border rounded-md">
      {imageUrl && (
        <div className="w-full max-w-[90vw] max-h-[500px] h-auto flex justify-center">
          <img
            src={he.decode(imageUrl)}
            alt="preview"
            className="object-contain w-full h-auto rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default PostPreview;
