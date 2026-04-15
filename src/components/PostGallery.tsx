import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { parseImageType } from "../utils/parser";

const MAX_VISIBLE_THUMBNAILS = 4;

type PostGalleryProps = {
  galleryData?: {
    items: {
      media_id: string;
    }[];
  };
  mediaMetadata?: any[];
};

const PostGallery: React.FC<PostGalleryProps> = memo(({ galleryData, mediaMetadata }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const imageUrls = useMemo(() => {
    if (!galleryData?.items) return [];
    return galleryData.items.map((item) => {
      const imageType = parseImageType(mediaMetadata?.[item.media_id as unknown as number]?.m ?? "");
      const imageUrl = `https://i.redd.it/${item.media_id}.${imageType}`;
      return { media_id: item.media_id, imageUrl };
    });
  }, [galleryData, mediaMetadata]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  }, [imageUrls.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  }, [imageUrls.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToPrev, goToNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  if (imageUrls.length === 0) return null;

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };
  const visibleCount = Math.min(imageUrls.length, MAX_VISIBLE_THUMBNAILS);
  const gridCols = visibleCount === 1 ? "grid-cols-1" : visibleCount === 2 ? "grid-cols-2" : visibleCount === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <>
      <div 
        className={`grid ${gridCols} gap-1`}
        role="list"
      >
        {imageUrls.slice(0, MAX_VISIBLE_THUMBNAILS).map((item, index) => (
          <div
            key={item.media_id}
            role="listitem"
            className="relative aspect-square overflow-hidden rounded-md cursor-pointer group"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openGallery(index);
              setCurrentIndex(index); 
              setIsOpen(true);
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={item.imageUrl}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            {index === MAX_VISIBLE_THUMBNAILS - 1 && imageUrls.length > MAX_VISIBLE_THUMBNAILS && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                <span className="text-xl font-bold text-white">+{imageUrls.length - MAX_VISIBLE_THUMBNAILS}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 bg-black/50"
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-white text-sm">
              {currentIndex + 1} / {imageUrls.length}
            </span>
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
                goToPrev();
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
                setIsOpen(false);
              }}
            >
              <img
                src={imageUrls[currentIndex].imageUrl}
                alt={`Image ${currentIndex + 1}`}
                className="max-h-[85vh] max-w-full object-contain"
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 md:right-4 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 md:p-4 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {imageUrls.length > 1 && (
            <div 
              className="flex items-center justify-center gap-1 p-3 bg-black/50 overflow-x-auto"
              onClick={(e) => e.preventDefault()}
            >
              {imageUrls.map((item, index) => (
                <button
                  type="button"
                  key={item.media_id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(index);
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
                    className="w-full h-full object-cover"
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