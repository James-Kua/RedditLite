import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Subreddit } from "../types/subreddit";
import he from "he";

const SearchInput: React.FC = () => {
  const isMobile = window.innerWidth <= 767;
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(
    !isMobile || window.location.pathname === "/"
  );
  const [subredditSuggestions, setSubredditSuggestions] = useState<Subreddit[]>(
    []
  );
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (search.trim() !== "") {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fetchSubredditSuggestions();
      }, 300);
    } else {
      setSubredditSuggestions([]);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [search]);

  const fetchSubredditSuggestions = async () => {
    try {
      const response = await fetch(
        `https://www.reddit.com/subreddits/search.json?q=${search}`
      );
      const data = await response.json();
      if (data && data.data && data.data.children) {
        const suggestions: Subreddit[] = data.data.children.map(
          (child: any) => ({
            ...child.data,
          })
        );
        setSubredditSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Error fetching subreddit suggestions:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleButtonClick = () => {
    if (search.trim() !== "") {
      const encodedQuery = encodeURIComponent(search);
      navigate(`/search/?q=${encodedQuery}&sort=relevance`);
      if (isMobile) {
        setIsExpanded(false);
      }
      setSearch("");
      setSubredditSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim() !== "") {
      handleButtonClick();
    }
  };

  const toggleExpand = () => {
    if (window.location.pathname !== "/") {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="relative">
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <div
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isExpanded ? "w-full" : "w-12 lg:w-full"
        }`}
      >
        <input
          type="text"
          id="subreddit-search"
          value={search}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder="Search Reddit"
          className={`transition-all duration-300 ease-in-out ${
            isExpanded
              ? "opacity-100 pl-2 pr-10 py-2.5"
              : "opacity-0 pl-0 pr-0 py-0 lg:opacity-100 lg:pl-2 lg:pr-10 lg:py-2.5"
          } w-full rounded-md border-gray-200 shadow-sm sm:text-sm dark:bg-slate-900 dark:text-white`}
        />
        <button
          type="button"
          onClick={toggleExpand}
          className="text-gray-600 hover:text-gray-700 ml-2 lg:hidden"
        >
          <span className="sr-only">Expand</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={toggleExpand}
          className={`absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-600 hover:text-gray-700 transition-opacity duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0 lg:opacity-100"
          }`}
        >
          <span className="sr-only"></span>
        </button>
      </div>
      {subredditSuggestions.length > 0 && (
        <div className="absolute mt-1 w-full rounded-md bg-white dark:bg-slate-800 shadow-lg z-10">
          <ul>
            {subredditSuggestions.slice(0, 6).map((subreddit, index) => (
              <a
                href={`/${subreddit.display_name_prefixed}`}
                className="text-gray-800"
              >
                <li
                  key={index}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  {subreddit?.community_icon ? (
                    <img
                      src={he.decode(subreddit.community_icon)}
                      alt="community_icon"
                      className="w-6 h-6 rounded-lg mr-2"
                    />
                  ) : subreddit?.icon_img ? (
                    <img
                      src={he.decode(subreddit.icon_img)}
                      alt="icon_img"
                      className="w-6 h-6 rounded-lg mr-2"
                    />
                  ) : null}
                  <p className="font-medium text-xs dark:text-white">
                    {subreddit.display_name_prefixed}
                  </p>
                </li>
              </a>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
