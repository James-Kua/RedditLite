import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { Subreddit } from "../types/subreddit";
import he from "he";
import SearchIcon from "../static/SearchIcon";
import { RedditApiClient } from "../api/RedditApiClient";

interface SearchInputProps {
  initialSearchInSubreddit?: boolean;
  currentSubreddit?: string | null;
}

const SearchInput: React.FC<SearchInputProps> = ({ initialSearchInSubreddit = false }) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 767);
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(() => !isMobile || window.location.pathname === "/");
  const [subredditSuggestions, setSubredditSuggestions] = useState<Subreddit[]>([]);
  const [searchInSubreddit, setSearchInSubreddit] = useState(initialSearchInSubreddit);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSubredditPath = matchPath({ path: "/r/:subreddit/*" }, location.pathname);
  const currentSubreddit = isSubredditPath ? isSubredditPath.params.subreddit : null;
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth <= 767;
      setIsMobile(nextIsMobile);
      setIsExpanded((expanded) => (!nextIsMobile || isHome ? true : expanded));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isHome]);

  useEffect(() => {
    setSearchInSubreddit(initialSearchInSubreddit);
  }, [initialSearchInSubreddit]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let mounted = true;

    if (search.trim() !== "") {
      setActiveIndex(-1);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (mounted) {
          fetchSubredditSuggestions();
        }
      }, 300);
    } else {
      setSubredditSuggestions([]);
    }

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isMobile) setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  const fetchSubredditSuggestions = async () => {
    try {
      const response = await RedditApiClient.fetch(`https://www.reddit.com/subreddits/search.json?q=${search}&limit=6`);
      const data = await response.json();
      if (data?.data?.children) {
        setSubredditSuggestions(data.data.children.map((child: any) => child.data));
      }
    } catch (error) {
      console.error("Error fetching subreddit suggestions:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (query?: string) => {
    const searchQuery = query || search;
    if (searchQuery.trim() === "") return;

    const encodedQuery = encodeURIComponent(searchQuery);
    const searchUrl =
      searchInSubreddit && currentSubreddit
        ? `/r/${currentSubreddit}/search/?q=${encodedQuery}&sort=relevance&t=year`
        : `/search/?q=${encodedQuery}&sort=relevance&t=year`;

    navigate(searchUrl);
    if (isMobile) setIsExpanded(false);
    setSearch("");
    setSubredditSuggestions([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (activeIndex === 0 && isSubredditPath) {
        handleSearchSubmit();
      } else if (activeIndex > 0 && subredditSuggestions[activeIndex - (isSubredditPath ? 1 : 0)]) {
        const subredditIndex = activeIndex - (isSubredditPath ? 1 : 0);
        navigate(`/${subredditSuggestions[subredditIndex].display_name_prefixed}`);
        setSearch("");
        setSubredditSuggestions([]);
        if (isMobile) setIsExpanded(false);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const totalItems = subredditSuggestions.length + (isSubredditPath ? 1 : 0);
      if (totalItems === 0) return;
      const nextIndex = (activeIndex + 1) % totalItems;
      setActiveIndex(nextIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const totalItems = subredditSuggestions.length + (isSubredditPath ? 1 : 0);
      if (totalItems === 0) return;
      const prevIndex = activeIndex <= 0 ? totalItems - 1 : activeIndex - 1;
      setActiveIndex(prevIndex);
    } else if (e.key === "Escape") {
      setSearch("");
      setSubredditSuggestions([]);
      if (isMobile) setIsExpanded(false);
    }
  };

  const handleHotkey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      inputRef.current?.focus();
    } else if (e.key === "/" && !(e.target as HTMLElement).matches("input, textarea")) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleHotkey);
    return () => window.removeEventListener("keydown", handleHotkey);
  }, []);

  const toggleExpand = () => {
    if (!isHome) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    }
  };

  const handleSuggestionClick = () => {
    if (isMobile) {
      setIsExpanded(false);
      setSearch("");
      setSubredditSuggestions([]);
    }
  };

  const showDropdown = search.length !== 0 && (!isMobile || isExpanded);
  const hasResults = subredditSuggestions.length > 0;
  const useMobileOverlay = isMobile && isExpanded && !isHome;
  const alignRightOnly = isMobile && !isHome;

  return (
    <div className={`relative ${alignRightOnly ? "flex justify-end" : "w-full"}`} ref={containerRef}>
      {useMobileOverlay && (
        <button
          type="button"
          aria-label="Close search"
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
        />
      )}
      <div className={`relative ${alignRightOnly ? "" : "w-full"}`}>
        {!isExpanded && isMobile && (
          <button
            onClick={toggleExpand}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-white/70 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
            aria-label="Open search"
          >
            <div className="w-5 h-5">
              <SearchIcon />
            </div>
          </button>
        )}

        {(isExpanded || !isMobile) && (
          <div className={useMobileOverlay ? "fixed left-3 right-3 top-3 z-50" : "relative"}>
            <input
              type="text"
              ref={inputRef}
              value={search}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder="Search Reddit"
              className={`h-10 w-full rounded-xl border border-slate-300 bg-white/95 pl-9 text-sm font-medium text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-white/10 dark:bg-neutral-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:bg-neutral-800 dark:focus:ring-blue-400/20 lg:h-12 lg:rounded-2xl lg:pr-32 ${
                isMobile && isHome ? "pr-4" : "pr-10"
              }`}
              autoComplete="off"
              aria-label="Search Reddit"
            />

            <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-zinc-500">
              <SearchIcon />
            </div>

            <div className="absolute right-0 top-0 h-full flex items-center">
              {isMobile && !isHome && (
                <button
                  onClick={toggleExpand}
                  className="flex h-full w-10 items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Close search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {!isMobile && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <kbd className="px-2 py-1 text-xs border border-gray-300 dark:border-slate-700 rounded bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                  /
                </kbd>
              </div>
            )}
          </div>
        )}
      </div>

      {showDropdown && (
        <div
          className={`z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900 ${
            useMobileOverlay
              ? "fixed left-3 right-3 top-14"
              : "absolute left-0 right-0 top-full mx-auto mt-1 max-w-full sm:max-w-md lg:max-w-lg xl:max-w-xl"
          }`}
        >
          <div className="max-h-[65vh] overflow-y-auto overscroll-contain">
            {isSubredditPath && (
              <div
                className={`px-3 py-3 border-b dark:border-slate-700 cursor-pointer ${
                  activeIndex === 0 ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
                onClick={() => {
                  handleSearchSubmit();
                  handleSuggestionClick();
                }}
                onMouseEnter={() => setActiveIndex(0)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center mr-3 shrink-0 text-white">
                      <SearchIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium dark:text-white">
                        Search in <span className="font-bold">r/{currentSubreddit}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchInSubreddit(!searchInSubreddit);
                    }}
                    className={`relative h-5 w-10 rounded-full transition-colors ${
                      searchInSubreddit ? "bg-blue-500" : "bg-gray-300 dark:bg-slate-700"
                    }`}
                    aria-label={searchInSubreddit ? "Disable search in subreddit" : "Enable search in subreddit"}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        searchInSubreddit ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {hasResults && (
              <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-700">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Communities
                </div>
              </div>
            )}

            {subredditSuggestions.map((subreddit, index) => {
              const adjustedIndex = index + (isSubredditPath ? 1 : 0);
              const isActive = activeIndex === adjustedIndex;
              const subscriberCount =
                subreddit.subscribers > 1000000
                  ? `${(subreddit.subscribers / 1000000).toFixed(1)}M`
                  : subreddit.subscribers > 1000
                  ? `${Math.round(subreddit.subscribers / 1000)}k`
                  : subreddit.subscribers;

              return (
                <a
                  href={`/${subreddit.display_name_prefixed}`}
                  className={`block ${
                    isActive ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={handleSuggestionClick}
                  onMouseEnter={() => setActiveIndex(adjustedIndex)}
                >
                  <div className="flex items-center px-3 py-3">
                    <div className="relative shrink-0 mr-3">
                      {subreddit.community_icon || subreddit.icon_img ? (
                        <img
                          src={he.decode(subreddit.community_icon || subreddit.icon_img)}
                          alt={subreddit.display_name}
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-slate-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center border border-gray-200 dark:border-slate-700">
                          <span className="text-white text-xs font-bold">r/</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold dark:text-white truncate">
                          {subreddit.display_name_prefixed}
                        </span>
                        {subreddit.subscribers && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            • {subscriberCount}
                          </span>
                        )}
                      </div>
                      {subreddit.public_description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
                          {subreddit.public_description}
                        </p>
                      )}
                    </div>

                    {isActive && !isMobile && (
                      <div className="ml-2 shrink-0">
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded text-gray-600 dark:text-gray-400">
                          Enter
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              );
            })}

            {hasResults && !isMobile && (
              <div className="px-4 py-3 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Use ↑↓ arrows, Enter to select</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
