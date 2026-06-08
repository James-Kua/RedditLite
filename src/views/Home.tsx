import { type DragEvent, useEffect, useState } from "react";
import SearchInput from "../components/SearchInput";
import SubredditIcon from "../components/SubredditIcon";
import { RedditApiClient } from "../api/RedditApiClient";

const STARRED_STORAGE_KEY = "reddit-lite-starred";

type StarredSubreddit = {
  name: string;
  community_icon: string;
  icon_img: string;
};

const getStarredSubredditNames = () => {
  try {
    const storedValue = localStorage.getItem(STARRED_STORAGE_KEY);
    const subreddits = storedValue ? JSON.parse(storedValue) : [];

    if (!Array.isArray(subreddits)) {
      return [];
    }

    return Array.from(
      new Set(
        subreddits.filter((subreddit): subreddit is string => typeof subreddit === "string" && subreddit.length > 0),
      ),
    );
  } catch {
    return [];
  }
};

const saveStarredSubredditOrder = (subreddits: StarredSubreddit[]) => {
  localStorage.setItem(STARRED_STORAGE_KEY, JSON.stringify(subreddits.map(({ name }) => name)));
};

const fetchStarredSubreddit = async (name: string): Promise<StarredSubreddit> => {
  try {
    const subreddit = await RedditApiClient.getSubreddit(name);

    return {
      name,
      community_icon: subreddit?.community_icon ?? "",
      icon_img: subreddit?.icon_img ?? "",
    };
  } catch {
    return {
      name,
      community_icon: "",
      icon_img: "",
    };
  }
};

const Home = () => {
  const [starredSubreddits, setStarredSubreddits] = useState<StarredSubreddit[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const subreddits = getStarredSubredditNames();

    if (subreddits.length === 0) {
      setStarredSubreddits([]);
      return;
    }

    let isActive = true;

    setStarredSubreddits(subreddits.map((name) => ({ name, community_icon: "", icon_img: "" })));

    const fetchSubredditIcons = async () => {
      const subredditData = await Promise.all(subreddits.map(fetchStarredSubreddit));

      if (!isActive) {
        return;
      }

      const subredditDataByName = new Map(subredditData.map((subreddit) => [subreddit.name, subreddit]));

      setStarredSubreddits((currentSubreddits) =>
        currentSubreddits.map((subreddit) => subredditDataByName.get(subreddit.name) ?? subreddit),
      );
    };

    fetchSubredditIcons();

    return () => {
      isActive = false;
    };
  }, []);

  const moveStarredSubreddit = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      return;
    }

    setStarredSubreddits((currentSubreddits) => {
      if (!currentSubreddits[fromIndex] || !currentSubreddits[toIndex]) {
        return currentSubreddits;
      }

      const nextSubreddits = [...currentSubreddits];
      const [movedSubreddit] = nextSubreddits.splice(fromIndex, 1);
      nextSubreddits.splice(toIndex, 0, movedSubreddit);
      saveStarredSubredditOrder(nextSubreddits);

      return nextSubreddits;
    });
  };

  const handleDragStart = (event: DragEvent<HTMLSpanElement>, index: number) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();

    if (draggedIndex !== null) {
      moveStarredSubreddit(draggedIndex, index);
    }

    setDraggedIndex(null);
  };

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
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Your Starred Communities
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsReordering((currentValue) => !currentValue);
                    setDraggedIndex(null);
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/5 dark:hover:text-white"
                  aria-pressed={isReordering}
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M6 4h8M6 10h8M6 16h8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  {isReordering ? "Done" : "Edit order"}
                </button>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-white/10">
                {starredSubreddits.map(({ name, community_icon, icon_img }, index) => (
                  <div
                    key={name}
                    onDragOver={isReordering ? handleDragOver : undefined}
                    onDrop={isReordering ? (event) => handleDrop(event, index) : undefined}
                    className={`group flex min-w-0 items-center gap-3 px-4 py-3 text-left transition ${
                      draggedIndex === index
                        ? "bg-orange-50 dark:bg-orange-300/10"
                        : "hover:bg-slate-100/80 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    {isReordering && (
                      <span
                        draggable
                        onDragStart={(event) => handleDragStart(event, index)}
                        onDragEnd={() => setDraggedIndex(null)}
                        className="inline-flex h-9 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing dark:hover:bg-white/10 dark:hover:text-slate-100"
                        title={`Drag r/${name}`}
                        aria-hidden="true"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M7 5.5h.01M13 5.5h.01M7 10h.01M13 10h.01M7 14.5h.01M13 14.5h.01"
                            stroke="currentColor"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    )}
                    <a href={`/r/${name}`} className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="shrink-0 transition-transform group-hover:scale-105">
                        <SubredditIcon community_icon={community_icon} icon_img={icon_img} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">r/{name}</p>
                      </div>
                    </a>
                    {isReordering ? (
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveStarredSubreddit(index, index - 1)}
                          disabled={index === 0}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          aria-label={`Move r/${name} up`}
                          title={`Move r/${name} up`}
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                              d="M10 15V5M5.75 9.25 10 5l4.25 4.25"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStarredSubreddit(index, index + 1)}
                          disabled={index === starredSubreddits.length - 1}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          aria-label={`Move r/${name} down`}
                          title={`Move r/${name} down`}
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                              d="M10 5v10M14.25 10.75 10 15l-4.25-4.25"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
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
                    )}
                  </div>
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
