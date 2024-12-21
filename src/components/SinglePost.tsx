import React, { useEffect, useState } from "react";
import { Post } from "../types/post";
import { Comment } from "../types/comment";
import SearchInput from "./SearchInput";
import { commentSortOptions } from "../utils/sortOptions";
import { FaTimes, FaSyncAlt } from "react-icons/fa";
import HomeIcon from "../static/HomeIcon";
import ArrowIcon from "../static/ArrowIcon";
import PostComponent from "./Post";
import CommentsComponent from "./Comments";

const SinglePost = ({
  subreddit,
  postId,
  title,
  comment_id,
}: {
  subreddit: string;
  postId: string;
  title: string;
  comment_id?: string;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsSortOption, setSortOption] = useState("");
  const [commentsSearchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsRefreshing(true);
    fetch(
      `https://www.reddit.com/r/${subreddit}/comments/${postId}/${title}/${comment_id}.json?sort=${commentsSortOption}`
    )
      .then((response) => response.json())
      .then((data) => {
        const [postList, commentList] = data;
        setPosts(
          postList.data.children.map((child: { data: Post }) => child.data)
        );
        setComments(
          commentList.data.children.map(
            (child: { data: Comment }) => child.data
          )
        );

        if (postList.data.children.length > 0) {
          if (commentsSortOption === "") {
            setSortOption(postList.data.children[0].data.suggested_sort);
          } else {
            setSortOption(commentsSortOption);
          }
        }
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [commentsSortOption, refreshKey]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleRefreshComments = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="dark:bg-custom-black dark:text-white min-h-screen">
      <div className="mx-auto md:w-8/12 xl:w-1/2 max-w-[90vw] flex flex-col justify-center relative py-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-between mb-5"
        >
          <ol className="flex items-center gap-1 text-sm text-gray-600">
            <li>
              <a href="/" className="block transition hover:text-gray-700">
                <span className="sr-only">Home</span>
                <HomeIcon />
              </a>
            </li>
            <li className="rtl:rotate-180">
              <ArrowIcon />
            </li>
            <li>
              <a
                href={`/r/${subreddit}`}
                className="flex h-8 items-center dark:text-white text-gray-500 text-lg font-bold"
              >
                {subreddit}
              </a>
            </li>
          </ol>
          <div className="search-input">
            <SearchInput />
          </div>
        </nav>

        {posts.map((post) => (
          <PostComponent key={post.id} post={post} />
        ))}

        <div 
          className="shrink-0 bg-gray-200 dark:bg-gray-700 h-[1.5px] w-full mb-4">
        </div>

        <div className="text-sm font-medium mb-4">
          All Comments
        </div>

        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex items-center relative">
            <input
              type="text"
              value={commentsSearchTerm}
              onChange={handleSearchChange}
              placeholder="Search comments"
              className="border border-gray-300 dark:bg-transparent rounded p-1 mr-2 sm: max-w-36 lg:max-w-48"
            />
            {commentsSearchTerm && (
              <FaTimes
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 mr-1"
                onClick={handleClearSearch}
              />
            )}
          </div>
          <div className="flex items-center whitespace-nowrap">
            <label className="mr-2">Sort by:</label>
            <select
              value={commentsSortOption}
              onChange={handleSortChange}
              className="border border-gray-300 dark:bg-transparent rounded p-1"
            >
              {commentSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              ))}
            </select>
            <FaSyncAlt
              onClick={handleRefreshComments}
              className={`ml-2 text-blue-500 cursor-pointer ${
                isRefreshing ? "animate-spin" : ""
              }`}
              size={16}
            />
          </div>
        </div>

        <CommentsComponent
          comments={comments}
          postAuthor={posts[0]?.author || ""}
          searchTerm={commentsSearchTerm}
        />
      </div>
    </div>
  );
};

export default SinglePost;
