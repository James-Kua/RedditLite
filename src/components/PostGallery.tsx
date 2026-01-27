import { useMemo } from "react";
import Slider from "react-slick";
import { parseImageType } from "../utils/parser";

type PostGalleryProps = {
  galleryData: {
    items: {
      media_id: string;
    }[];
  };
  mediaMetadata?: any[];
};

const PostGallery: React.FC<PostGalleryProps> = ({ galleryData, mediaMetadata }) => {
  const maxImageWidth = useMemo(() => window.innerWidth * 0.9, []);

  const imageUrls = useMemo(() => {
    return galleryData.items.map((item) => {
      const imageType = parseImageType(mediaMetadata?.[item.media_id as unknown as number]?.m ?? "");
      const imageUrl = `https://i.redd.it/${item.media_id}.${imageType}`;
      return { media_id: item.media_id, imageUrl };
    });
  }, [galleryData, mediaMetadata]);

  const settings = {
    customPaging: function (i: number) {
      const { imageUrl } = imageUrls[i];
      return (
        <a>
          <img src={imageUrl} className="w-6 h-6 object-cover rounded-md" loading="lazy" />
        </a>
      );
    },
    dots: true,
    fade: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className="px-6">
      {galleryData && (
        <Slider {...settings} className="mb-8">
          {imageUrls.map(({ media_id, imageUrl }) => (
            <div key={media_id} className="flex justify-center">
              <div
                className="max-h-[80vh] w-full flex items-center justify-center"
                style={{ maxWidth: `${maxImageWidth}px` }}
              >
                <img src={imageUrl} className="max-h-[70vh] max-w-full object-contain rounded-lg" alt="Gallery Image" />
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default PostGallery;
