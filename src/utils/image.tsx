import { useEffect, useState } from "react";

export const FetchImage = ({ url }: { url: string }) => {
  const [image, setImage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        const response = await fetch(`https://metafy.vercel.app/api?url=${url}`);
        const data = await response.json();

        if (!isMounted) return;

        const imageUrl = data.image || data.logo || null;
        if (imageUrl) {
          setImage(imageUrl);
        } else {
          setHasError(true);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
          console.error("Error fetching image:", error);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [url]);

  if (hasError || !image) return null;

  return (
    <div className="mt-4 flex justify-center items-center max-w-full mx-auto border rounded-sm p-2">
      <img
        src={image}
        alt="Fetched Image"
        className="rounded-md object-contain max-w-full max-h-[500px] w-auto h-auto"
        onError={() => setHasError(true)}
      />
    </div>
  );
};
