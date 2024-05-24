import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const isMobile = window.innerWidth <= 767;
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(!isMobile || window.location.pathname === "/");
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleButtonClick = () => {
    if (search.trim() !== "") {
      if (search.startsWith("/r/")) {
        navigate(`${search}`, { replace: true });
      } else {
        const encodedQuery = encodeURIComponent(search);
        navigate(`/search/?q=${encodedQuery}`, { replace: true });
      }
      if (isMobile) {
        setIsExpanded(false);
      }
      setSearch("");
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
          } w-full rounded-md border-gray-200 shadow-sm sm:text-sm`}
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
    </div>
  );
};

export default SearchInput;
