import { useEffect, useState, useRef, useCallback, memo } from "react";
import he from "he";
import SearchInput from "./SearchInput";
import { parsePermalink, isImage } from "../utils/parser";
import { Post } from "../types/post";
import { Subreddit, SubredditRules } from "../types/subreddit";
import AuthorFlairText from "./AuthorFlairText";
import LinkFlairText from "./LinkFlairText";
import { FetchImage } from "../utils/image";
import Thumbnail from "./Thumbnail";
import SubredditInfo from "./SubredditInfo";
import SubredditIcon from "./SubredditIcon";
import SelfTextHtml from "./SelfTextHtml";
import PostStats from "./PostStats";
import PostPreview from "./PostPreview";
import CreatedEditedLabel from "./CreatedEditedLabel";
import { timeOptions } from "../utils/timeOptions";
import { subredditSortOptions } from "../utils/sortOptions";
import SecureMediaEmbed from "./SecureMediaEmbed";
import SecureMedia from "./SecureMedia";
import PostGallery from "./PostGallery";
import ExternalLink from "./ExternalLink";
import HomeIcon from "../static/HomeIcon";
import ArrowIcon from "../static/ArrowIcon";
import PollData from "./PollData";
import { RedditApiClient } from "../api/RedditApiClient";
import { useNavigate, useParams } from "react-router-dom";
import SegmentedControl from "./SegmentedControl";
import BackToTopButton from "./BackToTopButton";
import TopPosterStatusBar from "./TopPosterStatusBar";

const NUM_TOP_POSTERS = 6;

export interface FeedProps {
  subreddit: string;
  initialTime: string;
  initialSort: string;
}

const Feed: React.FC<FeedProps> = memo(({ subreddit, initialTime, initialSort }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [subredditInfo, setSubredditInfo] = useState<Subreddit>();
  const [subredditRules, setSubredditRules] = useState<SubredditRules[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [time, setTime] = useState<string>(initialTime);
  const [sort, setSort] = useState<string>(params.sort || initialSort);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinel = useRef(null);
  const [isStarred, setIsStarred] = useState<boolean>(
    localStorage.getItem("reddit-lite-starred")?.includes(subreddit) || false,
  );
  const [topPosters, setTopPosters] = useState<[string, number][]>([]);

  useEffect(() => {
    const authorCounts: { [key: string]: number } = {};
    posts.forEach((post) => {
      authorCounts[post.author] = (authorCounts[post.author] || 0) + 1;
    });

    const sortedAuthors = Object.entries(authorCounts).sort(([, countA], [, countB]) => countB - countA);
    setTopPosters(sortedAuthors.slice(0, NUM_TOP_POSTERS));
  }, [posts]);

  useEffect(() => {
    if (sort === "top") {
      navigate(`/r/${subreddit}/${sort}/?t=${time}`, { replace: true });
    } else {
      navigate(`/r/${subreddit}/${sort}/`, { replace: true });
    }
  }, [sort, time, subreddit, navigate]);

  const fetchPosts = useCallback(() => {
    if (!hasMore) return;

    RedditApiClient.fetch(`https://www.reddit.com/r/${subreddit}/${sort}.json?after=${after}&t=${time}&sr_detail=true`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map((child: { data: Post }) => child.data);
        setPosts((prevPosts) => {
          const existingPostIds = new Set(prevPosts.map((p: Post) => p.id));
          const uniqueNewPosts = fetchedPosts.filter((p: Post) => !existingPostIds.has(p.id));
          return [...prevPosts, ...uniqueNewPosts];
        });
        setAfter(data.data.after);
        setHasMore(!!data.data.after);
      });
  }, [subreddit, after, hasMore]);

  useEffect(() => {
    setPosts([]);
    setAfter(null);
    setHasMore(true);

    RedditApiClient.fetch(`https://www.reddit.com/r/${subreddit}/${sort}.json?t=${time}&sr_detail=true`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map((child: { data: Post }) => child.data);
        setPosts(fetchedPosts);
        setAfter(data.data.after);
        setHasMore(!!data.data.after);
      });

    RedditApiClient.fetch(`https://www.reddit.com/r/${subreddit}/about.json`)
      .then((response) => response.json())
      .then((data) => {
        setSubredditInfo(data.data);
      });

    RedditApiClient.fetch(`https://www.reddit.com/r/${subreddit}/about/rules.json`)
      .then((response) => response.json())
      .then((data) => {
        setSubredditRules(data.rules as SubredditRules[]);
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

  const toggleSubredditStar = () => {
    let starredSubreddits: string[] = JSON.parse(localStorage.getItem("reddit-lite-starred") || "[]");

    const subredditIndex = starredSubreddits.indexOf(subreddit);
    if (subredditIndex !== -1) {
      starredSubreddits.splice(subredditIndex, 1);
    } else {
      starredSubreddits.push(subreddit);
    }

    localStorage.setItem("reddit-lite-starred", JSON.stringify(starredSubreddits));

    setIsStarred(!isStarred);
  };

  const filterOptions = [
    { label: "Sort by", options: subredditSortOptions },
    { label: "Time", options: timeOptions },
  ];

  return (
    <div className="dark:bg-custom-black dark:text-white">
      <div className="max-w-[95vw] mx-auto relative py-4">
        <nav aria-label="Breadcrumb" className="flex items-center justify-between mb-5">
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
            <button
              onClick={toggleSubredditStar}
              className={`text-yellow-400 dark:text-yellow-200 focus:outline-none mr-1 ${
                isStarred ? "text-yellow-500" : ""
              }`}
            >
              {isStarred ? "⭐" : "☆"}
            </button>
            {<SubredditIcon community_icon={subredditInfo?.community_icon} icon_img={subredditInfo?.icon_img} />}
            <h1 className="text-gray-500 dark:text-white font-bold text-lg tracking-wide">{subreddit}</h1>
          </ol>
          <div className="search-input">
            <SearchInput />
          </div>
        </nav>
        <div className="mb-2">
          {subredditInfo && <SubredditInfo subreddit={subredditInfo} rules={subredditRules} />}
        </div>
        <div className="mb-4 flex flex-wrap gap-3">
          {filterOptions.map((optionGroup, index) =>
            optionGroup.label === "Time" && sort !== "top" ? null : (
              <div className="flex items-center overflow-x-auto hide-scrollbar" key={index}>
                <label className="mr-2 font-medium text-sm text-gray-700 dark:text-gray-300">{optionGroup.label}</label>
                <SegmentedControl
                  options={optionGroup.options}
                  currentValue={optionGroup.label === "Sort by" ? sort : time}
                  onChange={(value) => {
                    switch (optionGroup.label) {
                      case "Sort by":
                        setSort(value);
                        break;
                      case "Time":
                        setTime(value);
                        break;
                    }
                  }}
                  label={optionGroup.label}
                />
              </div>
            ),
          )}
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-200 dark:bg-neutral-800 shadow-md rounded-xl p-2 mb-4 w-full mx-auto prose prose-sm text-gray-700 dark:text-gray-300 prose-headings:font-semibold prose-headings:text-xl break-inside-avoid"
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={
                      post.sr_detail?.community_icon?.length! > 1
                        ? post.sr_detail?.community_icon.replace(/&amp;/g, "&")
                        : post.sr_detail?.icon_img?.length! > 1
                          ? post.sr_detail?.icon_img.replace(/&amp;/g, "&")
                          : post.sr_detail?.header_img?.length! > 1
                            ? post.sr_detail?.header_img.replace(/&amp;/g, "&")
                            : "/fallback_reddit_icon.png"
                    }
                    alt={post.author}
                    className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600"
                  />
                  <a href={`/user/${post.author}`}>
                    <h3 className="text-blue-500 font-semibold whitespace-nowrap hover:underline">{post.author}</h3>
                  </a>
                  <AuthorFlairText
                    author_flair_richtext={post.author_flair_richtext}
                    author_flair_text={post.author_flair_text}
                    author_flair_background_color={post.author_flair_background_color}
                  />
                </div>
                <CreatedEditedLabel created={post.created} edited={post.edited} />

                <a href={parsePermalink(post.permalink)} className="block mt-2 group">
                  <h2 className="text-lg font-bold dark:text-white group-hover:underline">{he.decode(post.title)}</h2>
                  <LinkFlairText
                    link_flair_richtext={post.link_flair_richtext}
                    link_flair_text={post.link_flair_text}
                    link_flair_background_color={post.link_flair_background_color}
                  />
                  <div
                    className={`mt-3 ${
                      post.thumbnail === "spoiler" || post.thumbnail === "nsfw" || post.over_18 ? "blur-sm" : ""
                    }`}
                  >
                    {post.secure_media_embed?.media_domain_url ? (
                      <SecureMediaEmbed
                        url_overridden_by_dest={post.url_overridden_by_dest}
                        {...post.secure_media_embed}
                      />
                    ) : post.secure_media ? (
                      <SecureMedia {...post.secure_media} />
                    ) : post.media_metadata ? (
                      <div className="relative mt-2">
                        {post.gallery_data ? (
                          <PostGallery galleryData={post.gallery_data} mediaMetadata={post.media_metadata} />
                        ) : null}
                      </div>
                    ) : post.preview ? (
                      <PostPreview preview={post.preview} />
                    ) : post.url_overridden_by_dest ? (
                      isImage(post.url_overridden_by_dest) ? (
                        <img
                          src={post.url_overridden_by_dest}
                          alt="url_overridden_by_dest"
                          className="mt-4 max-w-full max-h-125 mx-auto border rounded-md p-2 object-contain"
                        />
                      ) : (
                        <FetchImage url={post.url_overridden_by_dest} />
                      )
                    ) : (
                      <Thumbnail thumbnail={post.thumbnail || ""} />
                    )}

                    {post.poll_data && <PollData poll_data={post.poll_data} />}

                    {post.selftext_html && <SelfTextHtml selftext_html={post.selftext_html} truncateLines={10} />}

                    {post.url_overridden_by_dest && post.post_hint === "link" && (
                      <ExternalLink url_overridden_by_dest={post.url_overridden_by_dest} />
                    )}

                    <PostStats score={post.score} num_comments={post.num_comments} />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div ref={sentinel} className="h-1"></div>{" "}
        <BackToTopButton />
        <TopPosterStatusBar topPosters={topPosters} />
      </div>
    </div>
  );
});

export default Feed;
