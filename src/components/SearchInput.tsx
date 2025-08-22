import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { Subreddit } from "../types/subreddit";
import he from "he";
import SearchIcon from "../static/SearchIcon";
import { RedditApiClient } from "../api/RedditApiClient";

const SearchInput: React.FC = () => {
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
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
      setIsExpanded(false);
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
    setIsExpanded(!isExpanded);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInSubreddit(e.target.checked);
  }
  
  const isSubredditPath = matchPath({ path: "/r/:subreddit/*"}, location.pathname);
  const currentSubreddit = isSubredditPath ? isSubredditPath.params.subreddit : null;
  const currentSubredditPrefixed = isSubredditPath ? isSubredditPath.pathnameBase : null; 

  return (
    <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <div
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isExpanded ? "w-full" : "w-11 sm:w-full"
        }`}
      >
        <input
          type="text"
          id="subreddit-search"
          ref={inputRef}
          value={search}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsExpanded(true)}
          placeholder="Search Reddit"
          className={`transition-all duration-300 ease-in-out border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 ${
            isExpanded
              ? "opacity-100 pl-3 pr-12 py-2.5 sm:py-3"
              : "opacity-0 pl-0 pr-0 py-0 w-0 sm:opacity-100 sm:pl-3 sm:pr-12 sm:py-2.5 sm:w-full"
          } w-full rounded-lg bg-white dark:bg-slate-900 text-sm dark:text-white shadow-sm hover:shadow-md transition-shadow`}
          aria-label="Search Reddit"
        />
        {/* Mobile expand button - only visible on mobile when collapsed */}
        <button
          type="button"
          onClick={toggleExpand}
          className="flex items-center justify-center w-11 h-11 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 sm:hidden rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Expand search"
        >
          <SearchIcon />
        </button>
        {/* Search button - visible when expanded or always on desktop */}
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={!search.trim()}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            isExpanded ? "opacity-100" : "opacity-0 sm:opacity-100"
          }`}
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      </div>
      {/* Dropdown suggestions - only show when there are suggestions or search options */}
      {(search.length > 0 && (subredditSuggestions.length > 0 || isSubredditPath)) && (
        <div className="absolute mt-2 w-full rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-slate-600 z-50 max-h-96 overflow-y-auto">
          <ul className="py-1">
            {search.length > 0 && isSubredditPath && (
              <li className="border-b border-gray-200 dark:border-slate-600">
                <div className="flex items-center px-4 py-3">
                  <input
                    type="checkbox"
                    id="search-in-subreddit"
                    checked={searchInSubreddit}
                    onChange={handleCheckboxChange}
                    className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="search-in-subreddit"
                    className="text-sm text-gray-800 dark:text-white cursor-pointer select-none"
                  >
                    Search in {currentSubredditPrefixed}
                  </label>
                </div>
              </li>
            )}
            {subredditSuggestions.slice(0, 6).map((subreddit, index) => (
              <li key={index}>
                <a
                  href={`/${subreddit.display_name_prefixed}`}
                  className="flex items-center px-4 py-3 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150 focus:bg-gray-50 dark:focus:bg-slate-700 focus:outline-none"
                >
                  {subreddit?.community_icon ? (
                    <img
                      src={he.decode(subreddit.community_icon)}
                      alt="Community icon"
                      className="w-6 h-6 rounded-full mr-3 flex-shrink-0"
                    />
                  ) : subreddit?.icon_img ? (
                    <img
                      src={he.decode(subreddit.icon_img)}
                      alt="Icon"
                      className="w-6 h-6 rounded-full mr-3 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full mr-3 flex-shrink-0 bg-gray-200 dark:bg-slate-600" />
                  )}
                  <span className="font-medium text-sm truncate">
                    {subreddit.display_name_prefixed}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
