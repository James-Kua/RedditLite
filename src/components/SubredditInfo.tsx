import React, { useMemo, useState } from "react";
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

const cleanDescriptionHtml = (html?: string) => {
  if (!html) return "";
  const cleaned = html.replace(/<!-- SC_OFF -->(.*?)<!-- SC_ON -->/gs, "$1");
  return he.decode(cleaned);
};

const SubredditInfo: React.FC<SubredditInfoProps> = ({ subreddit, rules }) => {
  const {
    accounts_active,
    subscribers,
    banner_background_image,
    banner_img,
    public_description_html,
    description_html,
    display_name_prefixed,
  } = subreddit || {};
  const [activeSection, setActiveSection] = useState<"description" | "rules" | null>(null);
  const [expandedRuleIndex, setExpandedRuleIndex] = useState<number | null>(null);

  const bannerImage = banner_background_image || banner_img;
  const publicDescription = useMemo(() => cleanDescriptionHtml(public_description_html), [public_description_html]);
  const fullDescription = useMemo(() => cleanDescriptionHtml(description_html), [description_html]);
  const rulesCount = rules?.length ?? 0;

  const toggleSection = (section: "description" | "rules") => {
    setActiveSection(activeSection === section ? null : section);
    setExpandedRuleIndex(null);
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-300/70 bg-slate-100 text-sm text-slate-700 shadow-sm shadow-slate-200/70 dark:border-white/10 dark:bg-neutral-800 dark:text-gray-300 dark:shadow-black/20">
      <div
        className="relative overflow-hidden bg-slate-200 dark:bg-slate-800"
        style={{
          backgroundImage: bannerImage ? `url(${he.decode(bannerImage)})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/95 via-slate-100/85 to-slate-100/60 dark:from-slate-950/85 dark:via-slate-950/65 dark:to-slate-950/35" />
        <div className="relative flex items-center p-3">
          {publicDescription ? (
            <div
              className="rich-text-content line-clamp-3 max-w-4xl text-sm leading-5 text-slate-800 prose prose-a:text-blue-600 dark:prose-invert dark:text-white/95 dark:prose-a:text-blue-300 [&_p]:m-0"
              dangerouslySetInnerHTML={{
                __html: publicDescription,
              }}
            />
          ) : (
            <p className="text-sm font-medium text-slate-700 dark:text-white/80">{display_name_prefixed}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-300/70 p-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {subscribers != null && (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
              <UserGroupIcon />
              <span>{subscribers.toLocaleString("en-US")} members</span>
            </div>
          )}
          {accounts_active != null && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
              <UserOnlineIcon />
              <span>{accounts_active.toLocaleString("en-US")} online</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {fullDescription && (
            <button
              type="button"
              onClick={() => toggleSection("description")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-neutral-800 ${
                activeSection === "description"
                  ? "bg-blue-500 text-white shadow-sm shadow-blue-500/20"
                  : "bg-white/80 text-slate-700 hover:bg-white dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {activeSection === "description" ? "Hide description" : "Description"}
            </button>
          )}
          {rulesCount > 0 && (
            <button
              type="button"
              onClick={() => toggleSection("rules")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-neutral-800 ${
                activeSection === "rules"
                  ? "bg-blue-500 text-white shadow-sm shadow-blue-500/20"
                  : "bg-white/80 text-slate-700 hover:bg-white dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {activeSection === "rules" ? "Hide rules" : "Rules"}
            </button>
          )}
        </div>
      </div>

      {activeSection === "description" && fullDescription && (
        <div className="border-t border-slate-300/70 bg-white/60 p-4 dark:border-white/10 dark:bg-black/10">
          <div
            className="rich-text-content max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-xs leading-6 text-slate-700 dark:border-white/10 dark:bg-neutral-900/60 dark:text-gray-300"
            dangerouslySetInnerHTML={{
              __html: fullDescription,
            }}
          />
        </div>
      )}

      {activeSection === "rules" && (
        <div className="border-t border-slate-300/70 bg-white/60 p-3 dark:border-white/10 dark:bg-black/10">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {rules?.map((rule, index) => (
              <li key={index} className="rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-neutral-900/50">
                <button
                  type="button"
                  onClick={() => setExpandedRuleIndex(expandedRuleIndex === index ? null : index)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs font-semibold text-slate-800 transition hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 dark:text-gray-100 dark:hover:text-blue-300"
                >
                  <span>{rule.short_name}</span>
                  {rule.description_html && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-blue-500">
                      {expandedRuleIndex === index ? "Close" : "View"}
                    </span>
                  )}
                </button>
                {expandedRuleIndex === index && rule.description_html && (
                  <div
                    className="rich-text-content border-t border-slate-200 px-3 py-2 text-xs leading-6 text-slate-600 dark:border-white/10 dark:text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: cleanDescriptionHtml(rule.description_html),
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default SubredditInfo;
