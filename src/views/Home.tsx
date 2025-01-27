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
    <div className="flex flex-col justify-center items-center min-h-screen px-4 text-center dark:bg-custom-black">
      <div className="space-y-2 mb-4">
        <h1 className="text-3xl font-bold font-mono tracking-wide text-gray-600 dark:text-white">
          RedditLite
        </h1>
        <h4 className="tracking-wide text-gray-500 dark:text-white text-md">
          Lightweight Reddit Browsing
        </h4>
      </div>

      <div className="w-full max-w-sm">
        <SearchInput />
      </div>

      <div className="mt-1 flex gap-3">
        <div className="p-2 text-sm text-gray-600 dark:text-gray-300">
          Browse the most popular posts from <a 
            href="/r/popular"
            className="text-blue-500 dark:text-blue-300 hover:underline font-medium"
          >
            /r/popular
          </a>
        </div>
      </div>
      {starredSubreddits.length > 0 && (
        <div className="mt-4 w-full max-w-sm">
          <h2 className="font-semibold text-md text-gray-600 dark:text-gray-200 mb-4">
            Your Starred Communities
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {starredSubreddits.map(({ name, community_icon, icon_img }) => (
              <a
                key={name}
                href={`/r/${name}`}
                className="group flex items-center p-1.5 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-sm"
              >
                <div className="flex items-center gap-1.5 w-full">
                  <div className="transform group-hover:scale-105 transition-transform">
                    <SubredditIcon community_icon={community_icon} icon_img={icon_img} />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">r/{name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300">
                      Visit Community →
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
