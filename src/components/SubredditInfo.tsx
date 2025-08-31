import React, { useState } from "react";
import he from "he";
import UserGroupIcon from "../static/UserGroupIcon";
import UserOnlineIcon from "../static/UserOnlineIcon";
import { SubredditRules } from "../types/subreddit";

export type SubredditInfoProps = {
  subreddit: {
    display_name_prefixed: string;
    banner_background_image?: string;
    banner_img?: string;
    subscribers?: number;
    public_description_html?: string;
    description_html?: string;
    accounts_active?: number;
  };
  rules?: SubredditRules[];
};

const SubredditInfo: React.FC<SubredditInfoProps> = ({ subreddit, rules }) => {
  const { accounts_active = 0, subscribers = 0, banner_background_image, banner_img, public_description_html, description_html } = subreddit || {};
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedRuleIndex, setExpandedRuleIndex] = useState<number | null>(null);

  const bannerImage = banner_background_image || banner_img;
  const gradientClass = "bg-gradient-to-r from-blue-200 to-green-200 dark:from-gray-800 dark:to-gray-900";

  const cleanDescriptionHtml = (html?: string) => {
    if (!html) return "";
    const cleaned = html.replace(/<!-- SC_OFF -->(.*?)<!-- SC_ON -->/gs, "$1");
    return he.decode(cleaned);
  };

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
        <div className="absolute inset-0 bg-black opacity-60 rounded-md" />
        <div
          className="rich-text-content text-sm leading-relaxed overflow-hidden text-white prose dark:prose-invert max-w-none relative"
          dangerouslySetInnerHTML={{
            __html: he.decode(public_description_html || ""),
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

      <div className="flex space-x-2 mt-2">
        {description_html && (
          <button
            onClick={() => setActiveSection(activeSection === "description" ? null : "description")}
            className="text-black dark:text-white font-medium text-xs bg-white/30 dark:bg-black/30 rounded-lg py-2 px-2 transition duration-200 hover:bg-white/50 dark:hover:bg-black/50"
          >
            {activeSection === "description" ? "Hide Description" : "Show Description"}
          </button>
        )}
        {rules && rules.length > 0 && (
          <button
            onClick={() => {
              setActiveSection(activeSection === "rules" ? null : "rules");
              setExpandedRuleIndex(null);
            }}
            className="text-black dark:text-white font-medium text-xs bg-white/30 dark:bg-black/30 rounded-lg py-2 px-2 transition duration-200 hover:bg-white/50 dark:hover:bg-black/50"
          >
            {activeSection === "rules" ? "Hide Rules" : "Show Rules"}
          </button>
        )}
      </div>

      {activeSection === "description" && (
        <div className="mt-2">
          <div
            className="rich-text-content leading-relaxed overflow-auto relative p-1 rounded-md text-xs"
            dangerouslySetInnerHTML={{
              __html: cleanDescriptionHtml(description_html),
            }}
          />
        </div>
      )}

      {activeSection === "rules" && (
        <ul className="text-black dark:text-white">
          {rules?.map((rule, index) => (
            <li key={index} className="ml-2 mt-2">
              <div
                onClick={() => setExpandedRuleIndex(expandedRuleIndex === index ? null : index)}
                className={`cursor-pointer font-medium text-xs mb-1 ${rule.description_html ? "text-blue-500" : ""}`}
              >
                {rule.short_name}
              </div>
              {expandedRuleIndex === index && rule.description_html && (
                <div
                  className="rich-text-content leading-relaxed overflow-hidden max-w-none relative mt-1 p-1 rounded-md text-xs ml-2"
                  dangerouslySetInnerHTML={{
                    __html: cleanDescriptionHtml(rule.description_html),
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubredditInfo;
