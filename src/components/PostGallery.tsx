import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { getGalleryImageUrl, isRedditImagePlaceholder } from "../utils/parser";
import { decode } from "he";
import { Post } from "../types/post";

const MAX_VISIBLE_THUMBNAILS = 4;

type PostGalleryProps = {
  galleryData?: {
    items: {
      media_id: string;
    }[];
  };
  mediaMetadata?: any[];
  post?: Post;
  onAllImagesDeleted?: (post: Post) => void;
};

type ImageStatus = "loaded" | "deleted" | "failed";

const PostGallery: React.FC<PostGalleryProps> = memo(({ galleryData, mediaMetadata, post, onAllImagesDeleted }) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageStatuses, setImageStatuses] = useState(new Map<string, ImageStatus>());
  const touchStartX = useRef<number | null>(null);

  const galleryImages = useMemo(() => {
    if (!galleryData?.items) return [];
    return galleryData.items.map(({ media_id }, originalIndex) => ({
      media_id,
      originalIndex,
      imageUrl: getGalleryImageUrl(media_id, mediaMetadata),
      originalSize: mediaMetadata?.[media_id as unknown as number]?.s,
    }));
  }, [galleryData, mediaMetadata]);

  const images = useMemo(() => galleryImages.filter(({ imageUrl }) => {
    const status = imageStatuses.get(imageUrl);
    return status !== "deleted" && status !== "failed";
  }), [galleryImages, imageStatuses]);
  const allImagesDeleted = galleryImages.length > 0 &&
    galleryImages.every(({ imageUrl }) => imageStatuses.get(imageUrl) === "deleted");

  useEffect(() => {
    if (allImagesDeleted && post) onAllImagesDeleted?.(post);
  }, [allImagesDeleted, onAllImagesDeleted, post]);

  const handleImageResult = (event: React.SyntheticEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLImageElement)) return;
    const image = event.target;
    const item = galleryImages.find(({ imageUrl }) => imageUrl === image.src);
    if (!item) return;

    let status: ImageStatus = "loaded";
    if (event.type === "error") {
      status = "failed";
    } else if (
      isRedditImagePlaceholder(image) &&
      item.originalSize?.x > 0 && item.originalSize?.y > 0 &&
      (item.originalSize.x !== image.naturalWidth || item.originalSize.y !== image.naturalHeight)
    ) {
      // Reddit serves the deletion notice as a decodable image, even with a 404.
      status = "deleted";
    }
    setImageStatuses((previous) => {
      if (previous.get(item.imageUrl) === status) return previous;
      return new Map(previous).set(item.imageUrl, status);
    });
  };

  const isOpen = selectedImageUrl !== null && images.length > 0;
  const selectedOriginalIndex = galleryImages.findIndex(({ imageUrl }) => imageUrl === selectedImageUrl);
  const nextAvailableIndex = images.findIndex(({ originalIndex }) => originalIndex >= selectedOriginalIndex);
  const currentIndex = nextAvailableIndex === -1 ? images.length - 1 : nextAvailableIndex;
  const moveSelection = useCallback((step: number) => {
    const nextIndex = (currentIndex + step + images.length) % images.length;
    setSelectedImageUrl(images[nextIndex]?.imageUrl ?? null);
  }, [currentIndex, images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveSelection(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveSelection(1);
      } else if (e.key === "Escape") {
        setSelectedImageUrl(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, moveSelection]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (isOpen && Math.abs(diff) > 50) moveSelection(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  if (images.length === 0) return null;

  const visibleCount = Math.min(images.length, MAX_VISIBLE_THUMBNAILS);
  const gridCols = visibleCount === 1 ? "grid-cols-1" : visibleCount === 2 ? "grid-cols-2" : visibleCount === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <>
      <div 
        className={`grid ${gridCols} gap-1`}
        role="list"
        onLoadCapture={handleImageResult}
        onErrorCapture={handleImageResult}
      >
        {images.slice(0, MAX_VISIBLE_THUMBNAILS).map((item, index) => (
          <div
            key={item.media_id}
            role="listitem"
            className="relative aspect-square overflow-hidden rounded-md cursor-pointer group"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedImageUrl(item.imageUrl);
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={item.imageUrl}
              alt={`Gallery ${index + 1}`}
              className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${imageStatuses.get(item.imageUrl) === "loaded" ? "" : "invisible"}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            {index === MAX_VISIBLE_THUMBNAILS - 1 && images.length > MAX_VISIBLE_THUMBNAILS && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                <span className="text-xl font-bold text-white">+{images.length - MAX_VISIBLE_THUMBNAILS}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onLoadCapture={handleImageResult}
          onErrorCapture={handleImageResult}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedImageUrl(null);
          }}
        >
          <div
            className="flex flex-col px-4 py-3 bg-black/50"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedImageUrl(null);
                }}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex-1 px-4 text-white overflow-hidden">
                {post ? (
                  <div className="flex flex-col py-0.5">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-blue-400 truncate max-w-[150px]">u/{post.author}</span>
                      <span className="text-gray-600">•</span>
                      <span className="truncate">{post.subreddit_name_prefixed}</span>
                    </div>
                    <h2 className="text-sm font-bold mt-0.5 line-clamp-1 leading-tight opacity-90">
                      {decode(post.title)}
                    </h2>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold truncate">Gallery</span>
                  </div>
                )}
              </div>
              <span className="text-white text-sm whitespace-nowrap">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          <div
            className="flex-1 flex items-center justify-center relative"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                moveSelection(-1);
              }}
              className="absolute left-2 md:left-4 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 md:p-4 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div 
              className="max-h-full max-w-full p-2 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedImageUrl(null);
              }}
            >
              <img
                key={images[currentIndex].imageUrl}
                src={images[currentIndex].imageUrl}
                alt={`Image ${currentIndex + 1}`}
                className={`max-h-[85vh] max-w-full object-contain ${imageStatuses.get(images[currentIndex].imageUrl) === "loaded" ? "" : "invisible"}`}
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                moveSelection(1);
              }}
              className="absolute right-2 md:right-4 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 md:p-4 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {images.length > 1 && (
            <div 
              className="flex items-center justify-center gap-1 p-3 bg-black/50 overflow-x-auto"
              onClick={(e) => e.preventDefault()}
            >
              {images.map((item, index) => (
                <button
                  type="button"
                  key={item.media_id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImageUrl(item.imageUrl);
                  }}
                  className={`shrink-0 w-12 h-12 rounded-md overflow-hidden transition-all ${
                    currentIndex === index
                      ? "ring-2 ring-white scale-110"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-full h-full object-cover ${imageStatuses.get(item.imageUrl) === "loaded" ? "" : "invisible"}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
});

export default PostGallery;
