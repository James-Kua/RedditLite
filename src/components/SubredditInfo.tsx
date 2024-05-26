import React from "react";
import he from "he";

type SubredditInfoProps = {
  public_description_html?: string;
  accounts_active?: number;
  subscribers?: number;
};

const SubredditInfo: React.FC<SubredditInfoProps> = ({
  public_description_html,
  accounts_active,
  subscribers,
}) => {
  const descriptionHtml = public_description_html || "";
  return (
    <div>
      <div
        className="text-gray-500 text-sm overflow-scroll dark:text-white"
        dangerouslySetInnerHTML={{
          __html: he.decode(descriptionHtml),
        }}
      />
      <div>
        {subscribers && (
          <p className="text-gray-500 text-sm font-medium mt-4 dark:text-white">
            🫂 {subscribers.toLocaleString("en-US")} Members
          </p>
        )}
        {accounts_active && (
          <p className="text-gray-500 text-sm font-medium mt-1 dark:text-white">
            🟢 {accounts_active.toLocaleString("en-US")} Online
          </p>
        )}
      </div>
    </div>
  );
};

export default SubredditInfo;
