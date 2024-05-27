import React from "react";
import { Post } from "../types/post";
import he from "he";

export type PostPreviewProps = Pick<Post, "preview">;

const PostPreview: React.FC<PostPreviewProps> = ({ preview }) => {
  if (!preview || !preview.images || preview.images[0].resolutions.length === 0)
    return null;

  const imageUrl = preview?.images[0].source.url ?? "";

  return (
    <div className="relative mt-2">
      {imageUrl && (
        <img
          src={he.decode(imageUrl)}
          alt="preview"
          className="relative rounded-md overflow-hidden xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
        />
      )}
    </div>
  );
};

export default PostPreview;
