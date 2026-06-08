import React, { useEffect, useMemo, useState } from "react";
import { Post } from "../types/post";
import { Comment } from "../types/comment";
import SearchInput from "./SearchInput";
import { commentSortOptions } from "../utils/sortOptions";
import { FaTimes, FaSyncAlt } from "react-icons/fa";
import HomeIcon from "../static/HomeIcon";
import ArrowIcon from "../static/ArrowIcon";
import SearchIcon from "../static/SearchIcon";
import PostComponent from "./Post";
import CommentsComponent from "./Comments";
import { RedditApiClient } from "../api/RedditApiClient";
import CustomDropdown from "./CustomDropdown";

export type SinglePostProps = {
  subreddit: string;
  postId: string;
  title: string;
  comment_id?: string;
};

const sortCommentsByTimestamp = (comments: Comment[], direction: "newest" | "oldest"): Comment[] => {
  const multiplier = direction === "newest" ? -1 : 1;

  return comments
    .map((comment) => {
      const children = comment.replies?.data?.children;

      if (!children?.length) {
        return comment;
      }

      const sortedReplies = sortCommentsByTimestamp(
        children.map((child) => child.data),
        direction,
      );

      return {
        ...comment,
        replies: {
          ...comment.replies,
          data: {
            ...comment.replies.data,
            children: sortedReplies.map((reply) => ({
              kind: "t1",
              data: reply,
            })),
          },
        },
      };
    })
    .sort((left, right) => {
      const timestampDifference = left.created_utc - right.created_utc;
      return timestampDifference === 0
        ? left.id.localeCompare(right.id) * multiplier
        : timestampDifference * multiplier;
    });
};

const getReplyComments = (comment: Comment): Comment[] => {
  return comment.replies?.data?.children?.map((child) => child.data).filter(Boolean) ?? [];
};

const countComments = (comments: Comment[]): number => {
  return comments.reduce((total, comment) => total + 1 + countComments(getReplyComments(comment)), 0);
};

const findComment = (comments: Comment[], commentId: string): Comment | null => {
  const normalizedCommentId = commentId.replace(/^t1_/, "");

  for (const comment of comments) {
    if (comment.id === normalizedCommentId || comment.id === commentId) {
      return comment;
    }

    const childMatch = findComment(getReplyComments(comment), normalizedCommentId);
    if (childMatch) {
      return childMatch;
    }
  }

  return null;
};

const SinglePost: React.FC<SinglePostProps> = ({ subreddit, postId, comment_id }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsSortOption, setSortOption] = useState<"newest" | "oldest">("newest");
  const [commentsSearchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const sortedComments = useMemo(() => {
    return sortCommentsByTimestamp(comments, commentsSortOption);
  }, [comments, commentsSortOption]);

  useEffect(() => {
    const load = async () => {
      setIsRefreshing(true);

      try {
        const [post, commentTree] = await Promise.all([
          RedditApiClient.getPost(postId),
          RedditApiClient.getCommentTree(postId),
        ]);
        const selectedComment = comment_id ? findComment(commentTree, comment_id) : null;
        const numComments = countComments(commentTree);

        setPosts(post ? [{ ...post, num_comments: numComments }] : []);
        setComments(selectedComment ? [selectedComment] : commentTree);
      } finally {
        setIsRefreshing(false);
      }
    };

    load();
  }, [postId, comment_id, refreshKey]);

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
      <div className="mx-auto md:w-8/12 xl:w-1/2 max-w-[95vw] flex flex-col justify-center relative py-4">
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

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="relative min-w-0 flex-1 sm:max-w-64">
            <div className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-zinc-500">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={commentsSearchTerm}
              onChange={handleSearchChange}
              placeholder="Search comments"
              className="h-8 w-full rounded-lg border border-slate-300 bg-white/95 pl-8 pr-8 text-xs font-medium text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-white/10 dark:bg-neutral-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:bg-neutral-800 dark:focus:ring-blue-400/20"
            />
            {commentsSearchTerm && (
              <button
                type="button"
                aria-label="Clear comment search"
                className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition hover:bg-slate-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-200"
                onClick={handleClearSearch}
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>
          <div className="flex items-center whitespace-nowrap">
            <label className="mr-2">Sort by:</label>
            <CustomDropdown
              label="Sort comments"
              options={commentSortOptions}
              value={commentsSortOption}
              onChange={(value) => setSortOption(value === "oldest" ? "oldest" : "newest")}
            />
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
          comments={sortedComments}
          postAuthor={posts[0]?.author || ""}
          searchTerm={commentsSearchTerm}
        />
      </div>
    </div>
  );
};

export default SinglePost;
