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
    <div className="flex flex-col justify-center items-center h-screen px-4 text-center dark:bg-custom-black">
      <h1 className="text-3xl font-bold font-mono tracking-wide text-gray-500 dark:text-white">RedditLite</h1>
      <h4 className="tracking-wide text-gray-500 dark:text-white">Lightweight Reddit Browsing</h4>
      <SearchInput />
      <p className="text-sm tracking-wide text-gray-500 dark:text-white mt-4">
        Browse the most popular posts from{" "}
        <a href="/r/popular" className="font-semibold text-blue-500 dark:text-blue-300">
          /r/popular
        </a>
      </p>

      <div className="mt-6 w-full px-2 max-w-sm text-sm">
        {starredSubreddits.length > 0 && (
          <>
            <p className="font-semibold text-md text-gray-600 dark:text-gray-200 mb-2">Your Starred Subreddits</p>
            <div className="grid grid-cols-1 gap-2">
              {starredSubreddits.map(({ name, community_icon, icon_img }) => (
                <div
                  key={name}
                  className="bg-gray-200 dark:bg-gray-700 p-2 rounded shadow text-gray-600 dark:text-gray-200 cursor-pointer text-sm flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <SubredditIcon community_icon={community_icon} icon_img={icon_img} />
                    <p className="font-semibold">{name}</p>
                  </div>
                  <a
                    href={`/r/${name}`}
                    className="text-blue-500 dark:text-blue-400 font-semibold hover:underline text-xs"
                  >
                    Visit
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
