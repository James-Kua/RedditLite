import { useEffect, useState, useRef, useCallback } from "react";
import he from "he";
import SearchInput from "./SearchInput";
import { parsePermalink, isImage } from "../utils/parser";
import { Post } from "../types/post";
import { Subreddit } from "../types/subreddit";
import AuthorFlairText from "./AuthorFlairText";
import LinkFlairText from "./LinkFlairText";
import { FetchImage } from "../utils/image";
import Thumbnail from "./Thumbnail";
import SubredditInfo from "./SubredditInfo";
import SubredditIcon from "./SubredditIcon";
import MediaMetadata from "./MediaMetadata";
import SelfTextHtml from "./SelfTextHtml";
import PostStats from "./PostStats";
import PostPreview from "./PostPreview";
import CreatedEditedLabel from "./CreatedEditedLabel";
import { timeOptions } from "../utils/timeOptions";
import { subredditSortOptions } from "../utils/sortOptions";
import SecureMediaEmbed from "./SecureMediaEmbed";

interface FeedProps {
  subreddit: string;
  initialTime: string;
  initialSort: string;
}

const Feed: React.FC<FeedProps> = ({ subreddit, initialTime, initialSort }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [subredditInfo, setSubredditInfo] = useState<Subreddit>();
  const [after, setAfter] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [time, setTime] = useState<string>(initialTime);
  const [sort, setSort] = useState<string>(initialSort);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinel = useRef(null);

  const fetchPosts = useCallback(() => {
    if (!hasMore) return;

    fetch(
      `https://www.reddit.com/r/${subreddit}/${sort}.json?after=${after}&t=${time}`
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
  }, [subreddit, after, hasMore]);

  useEffect(() => {
    setPosts([]);
    setAfter(null);
    setHasMore(true);

    fetch(`https://www.reddit.com/r/${subreddit}/${sort}.json?t=${time}`)
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
  }, [subreddit, sort, time]);

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

  const filterOptions = [
    { label: "Sort by", options: subredditSortOptions },
    { label: "Time", options: timeOptions },
  ];

  return (
    <div className="dark:bg-custom-black dark:text-white">
      <div className="md:w-8/12 xl:w-1/2 max-w-[90vw] mx-auto flex flex-col justify-center relative py-4">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            {
              <SubredditIcon
                community_icon={subredditInfo?.community_icon}
                icon_img={subredditInfo?.icon_img}
              />
            }
            <h1 className="text-gray-500 dark:text-white font-bold text-xl tracking-wide mr-1">
              {subreddit}
            </h1>
          </div>

          <div className="ml-1">
            <SearchInput />
          </div>
        </div>

        <div className="mb-2">
          <SubredditInfo
            public_description_html={subredditInfo?.public_description_html}
            accounts_active={subredditInfo?.accounts_active}
            subscribers={subredditInfo?.subscribers}
          />
        </div>

        <div className="mb-2">
          {filterOptions.map((optionGroup, index) =>
            optionGroup.label === "Time" && sort !== "top" ? null : (
              <div
                className="text-black dark:text-gray-400 text-sm mb-2"
                key={index}
              >
                <label className="mr-1 font-medium">{optionGroup.label}</label>
                <select
                  value={optionGroup.label === "Sort by" ? sort : time}
                  onChange={(e) => {
                    switch (optionGroup.label) {
                      case "Sort by":
                        setSort(e.target.value);
                        break;
                      case "Time":
                        setTime(e.target.value);
                        break;
                    }
                  }}
                  className="p-1 rounded dark:bg-gray-800 text-black dark:text-gray-400 font-medium"
                >
                  {optionGroup.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.key}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}
        </div>

        {posts.map((post) => (
          <a href={parsePermalink(post.permalink)} key={post.id}>
            <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-10 relative">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-blue-400">{post.author}</h3>
                  <AuthorFlairText
                    author_flair_richtext={post.author_flair_richtext}
                    author_flair_text={post.author_flair_text}
                    author_flair_background_color={
                      post.author_flair_background_color
                    }
                  />
                </div>
                <CreatedEditedLabel
                  created={post.created}
                  edited={post.edited}
                />
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
                {post.secure_media_embed?.media_domain_url ? (
                  <SecureMediaEmbed
                    url_overridden_by_dest={post.url_overridden_by_dest}
                    {...post.secure_media_embed}
                  />
                ) : post.media_metadata ? (
                  <MediaMetadata media_metadata={post.media_metadata} />
                ) : post.preview ? (
                  <PostPreview preview={post.preview} />
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

export default Feed;
