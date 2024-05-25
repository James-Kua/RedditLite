import { useEffect, useState } from "react";

export const FetchImage = ({ url }: { url: string }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch(`https://get-metafy.netlify.app/.netlify/functions/api?url=${url}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.image) {
          setImage(data.image);
        }
      });
  }, [url]);

  if (!image) return null;

  return (
    <img
      src={image}
      alt="metafy image"
      className="relative rounded-md overflow-hidden xs:w-[184px] w-[284px] block mt-2"
    />
  );
};
