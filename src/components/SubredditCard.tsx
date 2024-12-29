import React from "react";
import he from "he";

export interface SubredditCardProps {
  subreddit: {
    display_name_prefixed: string;
    banner_background_image?: string;
    banner_img?: string;
    community_icon?: string;
    icon_img?: string;
    subscribers?: number;
    public_description_html?: string;
  };
}

const SubredditCard: React.FC<SubredditCardProps> = ({ subreddit }) => {
  const bannerImage = subreddit.banner_background_image ?? subreddit.banner_img;

  return (
    <a
      href={`/${subreddit.display_name_prefixed}`}
      className="block my-1"
    >
      <div
        style={{
          backgroundImage: bannerImage ? `url(${he.decode(bannerImage)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative flex p-2 rounded-md cursor-pointer bg-gradient-to-r from-blue-100 to-green-100 dark:from-gray-800 dark:to-gray-900 overflow-auto hover:bg-gradient-to-r hover:from-blue-300 hover:to-green-300 dark:hover:from-gray-700 dark:hover:to-gray-800"
      >
        {bannerImage && (
          <div className="absolute inset-0 dark:bg-black dark:bg-opacity-80 bg-slate-100 bg-opacity-80"></div>
        )}
        <div className="relative z-10 flex items-center w-full space-x-4">
          {subreddit.community_icon ? (
            <img
              src={he.decode(subreddit.community_icon)}
              alt="community_icon"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : subreddit.icon_img ? (
            <img
              src={he.decode(subreddit.icon_img)}
              alt="icon_img"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-slate-600" />
          )}

          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-800 dark:text-white">
              {subreddit.display_name_prefixed}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(subreddit.subscribers ?? 0).toLocaleString("en-US")} subscribers
            </p>
            <div
              className="rich-text-content text-black text-xs leading-relaxed overflow-hidden dark:text-white mb-2"
              dangerouslySetInnerHTML={{
                __html: he.decode(subreddit.public_description_html ?? ""),
              }}
            />
          </div>
        </div>
      </div>
    </a>
  );
};

export default SubredditCard;
