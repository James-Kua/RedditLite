import React from "react";
import he from "he";
import UserGroupIcon from "../static/UserGroupIcon";
import UserOnlineIcon from "../static/UserOnlineIcon";

export type SubredditInfoProps = {
  subreddit: {
    display_name_prefixed: string;
    banner_background_image?: string;
    banner_img?: string;
    subscribers?: number;
    public_description_html?: string;
    accounts_active?: number;
  };
};

const SubredditInfo: React.FC<SubredditInfoProps> = ({ subreddit }) => {
  const { public_description_html = '', accounts_active = 0, subscribers = 0, banner_background_image, banner_img } = subreddit || {};

  const bannerImage = banner_background_image ?? banner_img;

  const gradientClass = "bg-gradient-to-r from-blue-200 to-green-200 dark:from-gray-800 dark:to-gray-900";

  return (
    <div className={`${gradientClass} p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-sm`}>
      <div
        style={{
          backgroundImage: bannerImage ? `url(${he.decode(bannerImage)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative flex p-2 rounded-md cursor-pointer overflow-auto"
      >
        <div className="absolute inset-0 bg-black opacity-30 rounded-md" />
        <div
          className="rich-text-content text-sm leading-relaxed overflow-hidden text-white prose dark:prose-invert max-w-none relative z-10"
          dangerouslySetInnerHTML={{
            __html: he.decode(public_description_html),
          }}
        />
      </div>
      <div className="flex justify-between items-center pt-1">
        <div className="flex items-center text-black dark:text-white bg-white/30 dark:bg-black/10 rounded-full px-1 py-1.5">
          {subscribers && (
            <>
              <span aria-label="members" className="mr-2">
                <UserGroupIcon />
              </span>
              <span className="text-xs sm:text-sm font-medium">{subscribers.toLocaleString("en-US")} Members</span>
            </>
          )}
        </div>
        <div className="flex items-center text-black dark:text-white bg-white/30 dark:bg-black/10 rounded-full px-1 py-1.5">
          {accounts_active && (
            <>
              <span aria-label="online" className="mr-2">
                <UserOnlineIcon />
              </span>
              <span className="text-xs sm:text-sm font-medium">{accounts_active.toLocaleString("en-US")} Online</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubredditInfo;
