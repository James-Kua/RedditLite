import { useEffect, useState } from "react";

export const FetchImage = ({ url }: { url: string }) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://get-metafy.netlify.app/.netlify/functions/api?url=${url}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.image) {
          setImage(data.image);
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, [url]);

  if (!image) return null;

  return (
    <div className="mt-4 flex justify-center items-center max-w-full mx-auto border rounded-sm p-2">
      <img
        src={image}
        alt="Fetched Image"
        className="rounded-md object-contain max-w-full max-h-[500px] w-auto h-auto"
      />
    </div>
  );
};
