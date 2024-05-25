import { useEffect, useState, useRef, useCallback } from "react";
import he from "he";
import SearchInput from "./SearchInput";
import { parseUnixTimestamp } from "../utils/datetime";
import { parsePermalink, parseImageType, isImage } from "../utils/parser";
import { Post } from "../types/post";
import { Subreddit } from "../types/subreddit";
import AuthorFlairText from "./AuthorFlairText";
import LinkFlairText from "./LinkFlairText";
import { FetchImage } from "../utils/image";
import Thumbnail from "./Thumbnail";

interface FeedProps {
  subreddit: string;
}

const Feed: React.FC<FeedProps> = ({ subreddit }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [subredditInfo, setSubredditInfo] = useState<Subreddit>();
  const [after, setAfter] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinel = useRef(null);

  const fetchPosts = useCallback(() => {
    if (!hasMore) return;

    fetch(`https://www.reddit.com/r/${subreddit}.json?after=${after}`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map(
          (child: { data: Post }) => child.data
        );
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setAfter(data.data.after);
        setHasMore(!!data.data.after);
      });
  }, [subreddit, after, hasMore]);

  useEffect(() => {
    setPosts([]);
    setAfter(null);
    setHasMore(true);

    fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map(
          (child: { data: Post }) => child.data
        );
        setPosts(fetchedPosts);
        setAfter(data.data.after);
        setHasMore(!!data.data.after);
      });

    fetch(`https://www.reddit.com/r/${subreddit}/about.json`)
      .then((response) => response.json())
      .then((data) => {
        setSubredditInfo(data.data);
      });

    document.title = `🤖 ${subreddit}`;
  }, [subreddit]);

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
        <div className="flex items-center">
          {subredditInfo?.community_icon ? (
            <img
              src={subredditInfo.community_icon.replace("&amp;", "&")}
              alt="community_icon"
              className="w-8 h-8 rounded-lg mr-2"
            />
          ) : subredditInfo?.icon_img ? (
            <img
              src={subredditInfo.icon_img.replace("&amp;", "&")}
              alt="icon_img"
              className="w-8 h-8 rounded-lg mr-2"
            />
          ) : null}
          <h1 className="text-gray-500 font-bold text-xl tracking-wide mr-1">
            {subreddit}
          </h1>
        </div>

        <div className="ml-1">
          <SearchInput />
        </div>
      </div>

      <div className="mb-6">
        <div
          className="text-gray-500 text-sm overflow-scroll"
          dangerouslySetInnerHTML={{
            __html: he.decode(subredditInfo?.public_description_html || ""),
          }}
        />

        <div>
          {subredditInfo?.subscribers && (
            <>
              <p className="text-gray-500 text-sm font-medium mt-4">
                🫂 {subredditInfo.subscribers.toLocaleString("en-US")} Members
              </p>
              <p className="text-gray-500 text-sm font-medium mt-1">
                🟢 {subredditInfo.accounts_active.toLocaleString("en-US")}{" "}
                Online
              </p>
            </>
          )}
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
            </div>
            <div className={`${post.thumbnail === "spoiler" ? "blur" : ""}`}>
              {post.media_metadata ? (
                <div>
                  <div className="relative mt-2">
                    <img
                      src={`https://i.redd.it/${
                        Object.keys(post.media_metadata)[0]
                      }.${parseImageType(
                        post.media_metadata[
                          Object.keys(
                            post.media_metadata
                          )[0] as unknown as number
                        ]?.m
                      )}`}
                      className="relative rounded-md overflow-hidden xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
                      alt="Image"
                    />
                  </div>
                </div>
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
              ) : post.url_overridden_by_dest ? (
                isImage(post.url_overridden_by_dest) ? (
                  <img
                    src={post.url_overridden_by_dest}
                    alt="url_overridden_by_dest"
                    className="relative rounded-md overflow-hidden xs:w-[184px] w-[284px] block mt-2"
                  />
                ) : (
                  <FetchImage url={post.url_overridden_by_dest} />
                )
              ) : (
                <Thumbnail thumbnail={post.thumbnail || ""} />
              )}
              {post.selftext_html && (
                <div
                  className="mt-1 text-md text-gray-700 overflow-scroll"
                  dangerouslySetInnerHTML={{
                    __html: truncateHtmlBody(
                      he.decode(post.selftext_html),
                      10
                    ).replace(/\n\n/g, "<br>"),
                  }}
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

export default Feed;
