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

const settings = {
  dots: true,
  infinite: false,
  speed: 200,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const PostGallery: React.FC<PostGalleryProps> = ({
  galleryData,
  mediaMetadata,
}) => {
  return (
    <div className="mb-8">
      {galleryData ? (
        <Slider {...settings} className="mb-8">
          {galleryData.items.map((item) => (
            <div
              key={item.media_id}
              className="h-full w-full flex items-center z-50"
            >
              <img
                src={`https://i.redd.it/${item.media_id}.${parseImageType(
                  mediaMetadata?.[item.media_id as unknown as number]?.m ?? ""
                )}`}
                className="relative rounded-lg overflow-hidden w-full h-auto block mt-2"
                alt="Gallery Image"
              />
            </div>
          ))}
        </Slider>
      ) : null}
    </div>
  );
};

export default PostGallery;
