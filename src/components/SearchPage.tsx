import React, { useState, useEffect, useRef, useCallback } from "react";
import SearchInput from "./SearchInput";
import { Post } from "../types/post";
import { isImage, parseImageType, parsePermalink } from "../utils/parser";
import { parseUnixTimestamp } from "../utils/datetime";
import he from "he";
import LinkFlairText from "./LinkFlairText";
import AuthorFlairText from "./AuthorFlairText";
import CustomTag from "./CustomTag";

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

  const truncateHtmlBody = (text: string, lines: number): string => {
    const truncated = text.split("\n").slice(0, lines).join("\n");
    return truncated;
  };

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
              <h3 className="text-sm">🕔 {parseUnixTimestamp(post.created)}</h3>
              <h2 className="text-xl font-semibold my-1">
                {he.decode(post.title)}
              </h2>
              <LinkFlairText
                link_flair_richtext={post.link_flair_richtext}
                link_flair_text={post.link_flair_text}
                link_flair_background_color={post.link_flair_background_color}
              />
              {post.thumbnail === "spoiler" && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-black text-xl font-bold">SPOILER</span>
                </div>
              )}
            </div>
            {post.media_metadata ? (
              <div>
                <div className="relative mt-2">
                  <img
                    src={`https://i.redd.it/${
                      Object.keys(post.media_metadata)[0]
                    }.${parseImageType(
                      post.media_metadata[
                        Object.keys(post.media_metadata)[0] as unknown as number
                      ]?.m
                    )}`}
                    className="relative rounded-[8px] overflow-hidden box-border border border-solid border-neutral-border-weak xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
                    alt="Image"
                  />
                </div>
              </div>
            ) : post.preview &&
              post.preview.images &&
              post.preview.images[0].resolutions.length > 0 ? (
              <div className="relative mt-2">
                <img
                  src={post.preview.images[0].source.url.replace(/&amp;/g, "&")}
                  alt="source_url"
                  className="relative rounded-[8px] overflow-hidden xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
                />
              </div>
            ) : post.url_overridden_by_dest &&
              isImage(post.url_overridden_by_dest) ? (
              <img
                src={post.url_overridden_by_dest}
                alt="url_overridden_by_dest"
                className="relative rounded-[8px] overflow-hidden box-border border border-solid border-neutral-border-weak xs:w-[184px] w-[284px] block mt-2"
              />
            ) : !(
                post.thumbnail === "self" ||
                post.thumbnail === "default" ||
                post.thumbnail === "spoiler" ||
                post.thumbnail === ""
              ) ? (
              post.thumbnail === "nsfw" ? (
                <CustomTag
                  fontSize="text-xs"
                  color="text-white"
                  backgroundColor="bg-red-500"
                  content="🔞 NSFW"
                />
              ) : (
                <img
                  src={post.thumbnail}
                  alt="thumbnail"
                  className="relative rounded-[8px] overflow-hidden box-border border border-solid border-neutral-border-weak xs:w-[184px] w-[284px] block mt-2"
                />
              )
            ) : null}
            {post.selftext_html && (
              <div
                className={`mt-1 text-md text-gray-700 overflow-scroll ${
                  post.thumbnail === "spoiler" ? "blur p-2" : ""
                }`}
                dangerouslySetInnerHTML={{
                  __html:
                    post.thumbnail === "spoiler"
                      ? truncateHtmlBody(he.decode(post.selftext_html), 10)
                      : he.decode(post.selftext_html).replace(/\n\n/g, "<br>"),
                }}
              />
            )}
            {
              <div className="text-gray-500 text-sm mt-2">
                🔼 {post.score} upvotes 💬 {post.num_comments} comments
              </div>
            }
          </div>
        </a>
      ))}
      <div ref={sentinel} className="h-1"></div>
    </div>
  );
};

export default SearchPage;
