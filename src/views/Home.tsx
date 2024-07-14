import { useEffect, useState } from "react";
import SearchInput from "../components/SearchInput";

const Home = () => {
  const [starredSubreddits, setStarredSubreddits] = useState<string[]>([]);

  useEffect(() => {
    const starred = localStorage.getItem("reddit-lite-starred");
    if (starred) {
      setStarredSubreddits(JSON.parse(starred));
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen px-4 gap-y-1 text-center dark:bg-custom-black">
      <h1 className="text-4xl font-bold font-mono tracking-wide text-gray-500 dark:text-white">
        RedditLite
      </h1>
      <h4 className="tracking-widest text-gray-500 dark:text-white">
        Lightweight Reddit Browsing
      </h4>
      <SearchInput />
      <p className="text-sm tracking-wide text-gray-500 dark:text-white mt-4">
        Browse the most popular posts from{" "}
        <a
          href="/r/popular"
          className="font-semibold text-blue-500 dark:text-blue-300"
        >
          /r/popular
        </a>
      </p>

      <div className="mt-4">
        {starredSubreddits.length > 0 && (
          <div className="text-gray-500 dark:text-white text-sm">
            Your Starred Subreddits:
            <ul className="list-disc list-inside">
              {starredSubreddits.map((subreddit) => (
                <li key={subreddit} className="mb-1">
                  <a
                    href={`/r/${subreddit}`}
                    className="text-blue-500 dark:text-blue-300 font-semibold"
                  >
                    {subreddit}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
