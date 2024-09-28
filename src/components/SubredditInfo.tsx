import React from "react";
import he from "he";

type SubredditInfoProps = {
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
    <div className={`${gradientClass} p-2 rounded-md text-sm overflow-scroll`}>
      <div
        className="text-black text-sm leading-relaxed overflow-hidden dark:text-white mb-2"
        dangerouslySetInnerHTML={{
          __html: he.decode(public_description_html),
        }}
      />
      <div className="flex flex-col space-y-1 text-sm">
        {subscribers && (
          <div className="flex items-center text-black dark:text-white">
            <span role="img" aria-label="members" className="mr-1">
              🫂
            </span>
            <span className="font-base">{subscribers.toLocaleString("en-US")} Members</span>
          </div>
        )}
        {accounts_active && (
          <div className="flex items-center text-black dark:text-white">
            <span role="img" aria-label="online" className="mr-1">
              🟢
            </span>
            <span className="font-base">{accounts_active.toLocaleString("en-US")} Online</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubredditInfo;
