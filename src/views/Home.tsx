import { useEffect, useState } from "react";
import SearchInput from "../components/SearchInput";
import SubredditIcon from "../components/SubredditIcon";
import { Subreddit } from "../types/subreddit";
import { RedditApiClient } from "../api/RedditApiClient";

const Home = () => {
  const [starredSubreddits, setStarredSubreddits] = useState<Subreddit[]>([]);

  useEffect(() => {
    const starred = localStorage.getItem("reddit-lite-starred");
    if (starred) {
      const subreddits = JSON.parse(starred);
      const fetchSubredditIcons = async () => {
        const subredditData = await Promise.all(
          subreddits.map(async (subreddit: string) => {
            const response = await RedditApiClient.fetch(`https://www.reddit.com/r/${subreddit}/about.json`);
            const data = await response.json();
            return {
              name: subreddit,
              community_icon: data.data.community_icon,
              icon_img: data.data.icon_img,
            };
          })
        );
        setStarredSubreddits(subredditData);
      };
      fetchSubredditIcons();
    }
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-black dark:text-white">
      <section className="relative isolate flex min-h-screen items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,69,0,0.08),rgba(248,250,252,0))] dark:hidden" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-white/10" />

        <div className="relative mx-auto grid w-full max-w-3xl items-center gap-10">
          <div className="flex flex-col items-center text-center">
            <a
              href="/"
              className="mb-8 inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200"
              aria-label="RedditLite home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff4500] text-base font-black text-white shadow-lg shadow-orange-600/20">
                r/
              </span>
              RedditLite
            </a>

            <h1 className="max-w-xl text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
              Browse Reddit with less noise.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
              Ad-free and minimalist version of Reddit
            </p>

            <div className="mt-9 w-full max-w-xl">
              <SearchInput />
            </div>

            <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              <span>Browse the most popular posts from</span>
              <a
                href="/r/popular"
                className="ml-2 inline-flex items-center gap-1.5 font-semibold text-[#d93a00] transition hover:text-[#b83200] dark:text-orange-300 dark:hover:text-orange-200"
              >
                /r/popular
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M7.5 4.75 12.75 10 7.5 15.25"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {starredSubreddits.length > 0 && (
            <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white text-left shadow-xl shadow-slate-950/5 dark:border-white/10 dark:bg-[#101214] dark:shadow-black/20">
              <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Your Starred Communities
                </h2>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {starredSubreddits.map(({ name, community_icon, icon_img }) => (
                  <a
                    key={name}
                    href={`/r/${name}`}
                    className="group flex min-w-0 items-center px-4 py-3 text-left transition hover:bg-slate-100/80 dark:hover:bg-white/[0.04]"
                  >
                    <div className="shrink-0 transition-transform group-hover:scale-105">
                      <SubredditIcon community_icon={community_icon} icon_img={icon_img} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">r/{name}</p>
                    </div>
                    <svg
                      className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#ff4500] dark:group-hover:text-orange-300"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7.5 4.75 12.75 10 7.5 15.25"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
