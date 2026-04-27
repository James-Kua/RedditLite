import React from "react";
import { Post } from "../types/post";
import he from "he";
import ReactPlayer from "react-player";

export type PostPreviewProps = Pick<Post, "preview">;

const PostPreview: React.FC<PostPreviewProps> = ({ preview }) => {
  if (!preview || !preview.images || preview.images.length === 0) return null;

  const videoPreview = preview.reddit_video_preview;
  const image = preview.images && preview.images[0];
  const isGif = image?.variants?.gif;

  let imageUrl = "";
  if (isGif && image?.variants?.gif?.source) {
    imageUrl = image.variants.gif.source.url;
  } else if (image?.source) {
    imageUrl = image.source.url;
  }

  const handlePlayerClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="relative mt-2 flex justify-center">
      {videoPreview ? (
        <div className="w-full max-w-[95vw] max-h-[500px] h-auto flex justify-center bg-neutral-900 rounded-lg overflow-hidden">
          <ReactPlayer
            src={videoPreview.hls_url ?? videoPreview.fallback_url}
            controls
            width="100%"
            height="100%"
            playing={false}
            muted
            onClick={handlePlayerClick}
          />
        </div>
      ) : (
        imageUrl && (
          <div className="w-full max-w-[95vw] max-h-[500px] h-auto flex justify-center">
            <img src={he.decode(imageUrl)} alt="preview" className="object-contain w-full h-auto rounded-lg" />
          </div>
        )
      )}
    </div>
  );
};

export default PostPreview;
