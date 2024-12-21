import React from "react";
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
  const maxImageWidth = window.innerWidth * 0.9;

  const settings = {
    customPaging: function (i: number) {
      const item = galleryData.items[i];
      const imageUrl = `https://i.redd.it/${item.media_id}.${parseImageType(
        mediaMetadata?.[item.media_id as unknown as number]?.m ?? ""
      )}`;

      return (
        <a>
          <img
            src={imageUrl}
            className="w-6 h-6 object-cover rounded-md"
          />
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
      {galleryData ? (
        <Slider {...settings} className="mb-8">
          {galleryData.items.map((item) => (
            <div key={item.media_id} className="flex justify-center">
              <div
                className="max-h-[80vh] w-full flex items-center justify-center"
                style={{ maxWidth: `${maxImageWidth}px` }}
              >
                <img
                  src={`https://i.redd.it/${item.media_id}.${parseImageType(
                    mediaMetadata?.[item.media_id as unknown as number]?.m ?? ""
                  )}`}
                  className="max-h-[50vh] max-w-full object-contain rounded-lg"
                  alt="Gallery Image"
                />
              </div>
            </div>
          ))}
        </Slider>
      ) : null}
    </div>
  );
};

export default PostGallery;
