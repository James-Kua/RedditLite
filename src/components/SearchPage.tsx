import React, { useState, useEffect, useRef, useCallback } from "react";
import SearchInput from "./SearchInput";
import { Post } from "../types/post";
import { isImage, parsePermalink } from "../utils/parser";
import { parseUnixTimestamp } from "../utils/datetime";
import he from "he";
import LinkFlairText from "./LinkFlairText";
import AuthorFlairText from "./AuthorFlairText";
import Thumbnail from "./Thumbnail";
import MediaMetadata from "./MediaMetadata";
import SelfTextHtml from "./SelfTextHtml";
import PostStats from "./PostStats";
import PostPreview from "./PostPreview";
import { sortOptions } from "../utils/sortOptions";

interface SearchPageProps {
  query: string;
  sort: string;
}

const SearchPage: React.FC<SearchPageProps> = ({
  query,
  sort: initialSort,
}) => {
  const [userQuery, setUserQuery] = useState<string>(query);
  const [posts, setPosts] = useState<Post[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState<string>(initialSort);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(() => {
    if (!hasMore || !userQuery) return;

    fetch(
      `https://www.reddit.com/search.json?q=${userQuery}&after=${after}&sort=${sort}`
    )
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map(
          (child: { data: Post }) => child.data
        );
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setAfter(data.data.after);
        setHasMore(!!data.data.after);
      });
  }, [userQuery, after, hasMore, sort]);

  useEffect(() => {
    setUserQuery(query);
  }, [query]);

  useEffect(() => {
    setPosts([]);
    setAfter(null);
    setHasMore(true);

    if (userQuery) {
      fetch(`https://www.reddit.com/search.json?q=${userQuery}&sort=${sort}`)
        .then((response) => response.json())
        .then((data) => {
          const fetchedPosts = data.data.children.map(
            (child: { data: Post }) => child.data
          );
          setPosts(fetchedPosts);
          setAfter(data.data.after);
          setHasMore(!!data.data.after);
        });
    }
  }, [userQuery, sort]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts();
      }
    }, options);

    if (observer.current && sentinel.current) {
      observer.current.observe(sentinel.current);
    }
  }, [fetchPosts, hasMore]);

  return (
    <div className="dark:bg-custom-black text-white">
      <div className="md:w-8/12 xl:w-1/2 max-w-[90vw] mx-auto flex flex-col justify-center relative py-4">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-gray-500 font-bold text-xl mr-1 whitespace-nowrap">
            Search Results
          </h1>
          <div className="ml-1">
            <SearchInput />
          </div>
        </div>

        <div className="mb-2 font-medium text-gray-400">
          Showing search results for{" "}
          <span className="font-semibold italic">
            {decodeURIComponent(userQuery)}
          </span>
        </div>
        <div className="text-black dark:text-gray-400 text-sm mb-2">
          <label className="mr-1 font-medium">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-1 rounded dark:bg-gray-800 text-black dark:text-gray-400 font-medium"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.key}
              </option>
            ))}
          </select>
        </div>

        {posts.map((post) => (
          <a href={parsePermalink(post.permalink)} key={post.id}>
            <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-8 relative">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{post.author}</h3>
                  <AuthorFlairText
                    author_flair_richtext={post.author_flair_richtext}
                    author_flair_text={post.author_flair_text}
                    author_flair_background_color={
                      post.author_flair_background_color
                    }
                  />
                </div>
                <div className="bg-slate-100 dark:bg-slate-600 p-1 w-fit rounded-lg my-1">
                  <span className="text-gray-500 text-sm font-semibold dark:text-white">
                    <a href={`/${post.subreddit_name_prefixed}`}>
                      {post.subreddit_name_prefixed}
                    </a>
                  </span>
                </div>
                <h3 className="text-sm">
                  🕔 {parseUnixTimestamp(post.created)}
                </h3>
                <h2 className="text-lg font-semibold my-1 dark:text-white">
                  {he.decode(post.title)}
                </h2>
                <LinkFlairText
                  link_flair_richtext={post.link_flair_richtext}
                  link_flair_text={post.link_flair_text}
                  link_flair_background_color={post.link_flair_background_color}
                />
              </div>
              <div className={`${post.thumbnail === "spoiler" ? "blur" : ""}`}>
                {post.media_metadata ? (
                  <MediaMetadata media_metadata={post.media_metadata} />
                ) : post.preview ? (
                  <PostPreview preview={post.preview} />
                ) : post.url_overridden_by_dest &&
                  isImage(post.url_overridden_by_dest) ? (
                  <img
                    src={post.url_overridden_by_dest}
                    alt="url_overridden_by_dest"
                    className="relative rounded-md overflow-hidden xs:w-[184px] w-[284px] block mt-2"
                  />
                ) : (
                  <Thumbnail thumbnail={post.thumbnail || ""} />
                )}
                {post.selftext_html && (
                  <SelfTextHtml
                    selftext_html={post.selftext_html}
                    truncateLines={10}
                  />
                )}
                <PostStats
                  score={post.score}
                  num_comments={post.num_comments}
                />
              </div>
            </div>
          </a>
        ))}
        <div ref={sentinel} className="h-1"></div>
      </div>
    </div>
  );
};

export default SearchPage;
