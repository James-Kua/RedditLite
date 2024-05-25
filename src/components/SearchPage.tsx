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

interface SearchPageProps {
  query: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ query }) => {
  const [userQuery, setUserQuery] = useState<string>(query);
  const [posts, setPosts] = useState<Post[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(() => {
    if (!hasMore || !userQuery) return;

    fetch(`https://www.reddit.com/search.json?q=${userQuery}&after=${after}`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map(
          (child: { data: Post }) => child.data
        );
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setAfter(data.data.after);
        setHasMore(!!data.data.after);
      });
  }, [userQuery, after, hasMore]);

  useEffect(() => {
    setUserQuery(query);
  }, [query]);

  useEffect(() => {
    setPosts([]);
    setAfter(null);
    setHasMore(true);

    if (userQuery) {
      fetch(`https://www.reddit.com/search.json?q=${userQuery}`)
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
  }, [userQuery]);

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
    <div className="md:w-8/12 xl:w-1/2 max-w-[90vw] mx-auto flex flex-col justify-center relative py-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-gray-500 font-bold text-xl mr-1">Search Results</h1>
        <div className="ml-1">
          <SearchInput />
        </div>
      </div>

      {posts.map((post) => (
        <a href={parsePermalink(post.permalink)} key={post.id}>
          <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-10 relative">
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
              <div className="bg-slate-100 p-1 w-fit rounded-lg">
                <span className="text-gray-500 text-sm font-semibold">
                  <a href={`/${post.subreddit_name_prefixed}`}>
                    {post.subreddit_name_prefixed}
                  </a>
                </span>
              </div>
              <h3 className="text-sm">🕔 {parseUnixTimestamp(post.created)}</h3>
              <h2 className="text-xl font-semibold my-1">
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
                <MediaMetadata mediaMetadata={post.media_metadata} />
              ) : post.preview &&
                post.preview.images &&
                post.preview.images[0].resolutions.length > 0 ? (
                <div className="relative mt-2">
                  <img
                    src={post.preview.images[0].source.url.replace(
                      /&amp;/g,
                      "&"
                    )}
                    alt="source_url"
                    className="relative rounded-md overflow-hidden xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
                  />
                </div>
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
              <div className="text-gray-500 text-sm mt-2">
                🔼 {post.score} upvotes 💬 {post.num_comments} comments
              </div>
            </div>
          </div>
        </a>
      ))}
      <div ref={sentinel} className="h-1"></div>
    </div>
  );
};

export default SearchPage;
