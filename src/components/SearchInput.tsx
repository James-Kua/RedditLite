import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { Subreddit } from "../types/subreddit";
import he from "he";
import SearchIcon from "../static/SearchIcon";
import { RedditApiClient } from "../api/RedditApiClient";

const SearchInput: React.FC = () => {
  const isMobile = window.innerWidth <= 767;
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(
    !isMobile || window.location.pathname === "/"
  );
  const [subredditSuggestions, setSubredditSuggestions] = useState<Subreddit[]>(
    []
  );
  const [searchInSubreddit, setSearchInSubreddit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

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
      const response = await RedditApiClient.fetch(
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
      const searchUrl =
        searchInSubreddit && currentSubreddit
          ? `/r/${currentSubreddit}/search/?q=${encodedQuery}&sort=relevance&t=year`
          : `/search/?q=${encodedQuery}&sort=relevance&t=year`;
      navigate(searchUrl);
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

  const handleHotkey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleHotkey);
    return () => {
      window.removeEventListener("keydown", handleHotkey);
    };
  }, []);

  const toggleExpand = () => {
    if (window.location.pathname !== "/") {
      setIsExpanded(!isExpanded);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInSubreddit(e.target.checked);
  }
  
  const isSubredditPath = matchPath({ path: "/r/:subreddit/*"}, location.pathname);
  const currentSubreddit = isSubredditPath ? isSubredditPath.params.subreddit : null;
  const currentSubredditPrefixed = isSubredditPath ? isSubredditPath.pathnameBase : null; 

  return (
    <div className="relative">
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <div
        className={`flex items-center transition-all duration-300 ease-in-out ml-1 ${
          isExpanded ? "w-full" : "w-12 lg:w-full"
        }`}
      >
        <input
          type="text"
          id="subreddit-search"
          ref={inputRef}
          value={search}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder="Search Reddit"
          className={`transition-all duration-300 ease-in-out ${
            isExpanded
              ? "opacity-100 pl-2 pr-10 py-2.5"
              : "opacity-0 pl-0 pr-0 py-0 lg:opacity-100 lg:pl-2 lg:pr-10 lg:py-2.5"
          } w-full rounded-md border-gray-200 shadow-sm text-sm dark:bg-slate-900 dark:text-white`}
        />
        <button
          type="button"
          onClick={toggleExpand}
          className="text-gray-600 hover:text-gray-700 ml-2 lg:hidden"
        >
          <span className="sr-only">Expand</span>
          <SearchIcon />
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
      {
        <div className="absolute mt-1 w-full rounded-md bg-white dark:bg-slate-800 shadow-lg z-10">
          <ul>
            {search.length !== 0 && isSubredditPath && (
              <div className="flex items-center px-4 py-3">
                <input
                  type="checkbox"
                  id="search-in-subreddit"
                  checked={searchInSubreddit}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label
                  htmlFor="search-in-subreddit"
                  className="text-xs text-gray-800 dark:text-white"
                >
                  Search in {currentSubredditPrefixed}
                </label>
              </div>
            )}
            {subredditSuggestions.slice(0, 6).map((subreddit, index) => (
              <a
                href={`/${subreddit.display_name_prefixed}`}
                className="text-gray-800"
                key={index}
              >
                <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 z-100">
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
      }
    </div>
  );
};

export default SearchInput;
