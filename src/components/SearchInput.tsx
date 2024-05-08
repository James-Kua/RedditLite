import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleButtonClick = () => {
    if (search.trim() !== "") {
        navigate(`/${search}`);
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim() !== "") {
      handleButtonClick();
    }
  };

  return (
    <div className="relative">
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>

      <input
        type="text"
        id="subreddit-search"
        value={search}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        placeholder="Search for subreddit"
        className="w-full rounded-md border-gray-200 py-2.5 pl-2 pr-10 shadow-sm sm:text-sm"
      />

      <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
        <button
          type="button"
          onClick={handleButtonClick}
          className="text-gray-600 hover:text-gray-700"
        >
          <span className="sr-only">Search</span>
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
      </span>
    </div>
  );
};

export default SearchInput;
