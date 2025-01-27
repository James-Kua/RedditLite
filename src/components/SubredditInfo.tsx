import React from "react";
import he from "he";
import UserGroupIcon from "../static/UserGroupIcon";
import UserOnlineIcon from "../static/UserOnlineIcon";

export type SubredditInfoProps = {
  public_description_html?: string;
  accounts_active?: number;
  subscribers?: number;
};

const SubredditInfo: React.FC<SubredditInfoProps> = ({ public_description_html, accounts_active, subscribers }) => {
  if (!public_description_html) {
    return null;
  }

  const gradientClass = "bg-gradient-to-r from-blue-200 to-green-200 dark:from-gray-800 dark:to-gray-900";

  return (
    <div className={`${gradientClass} p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-sm`}>
      <div
        className="rich-text-content text-black text-sm leading-relaxed overflow-hidden dark:text-white mb-4 prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: he.decode(public_description_html),
        }}
      />
      <div className="flex justify-between items-center pt-1">
        {subscribers && (
          <div className="flex items-center text-black dark:text-white bg-white/30 dark:bg-black/10 rounded-full px-1 py-1.5">
            <span aria-label="members" className="mr-2">
              <UserGroupIcon />
            </span>
            <span className="text-xs sm:text-sm font-medium">{subscribers.toLocaleString("en-US")} Members</span>
          </div>
        )}
        {accounts_active && (
          <div className="flex items-center text-black dark:text-white bg-white/30 dark:bg-black/10 rounded-full px-1 py-1.5">
            <span aria-label="online" className="mr-2">
              <UserOnlineIcon />
            </span>
            <span className="text-xs sm:text-sm font-medium">{accounts_active.toLocaleString("en-US")} Online</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubredditInfo;
