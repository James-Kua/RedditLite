import { useEffect, useState, useRef, useCallback, memo, useMemo } from "react";
import { UserProfile } from "../types/user";
import { Post } from "../types/post";
import he from "he";
import { FetchImage } from "../utils/image";
import { isImage, getPostType } from "../utils/parser";
import UserKarma from "./UserKarma";
import PostStats from "./PostStats";
import SearchInput from "./SearchInput";
import SelfTextHtml from "./SelfTextHtml";
import BodyHtml from "./BodyHtml";
import CreatedEditedLabel from "./CreatedEditedLabel";
import PollData from "./PollData";
import PostGallery from "./PostGallery";
import { RedditApiClient } from "../api/RedditApiClient";
import PostPreview from "./PostPreview";
import SecureMedia from "./SecureMedia";
import SecureMediaEmbed from "./SecureMediaEmbed";
import Thumbnail from "./Thumbnail";
import { postTypeOptions } from "../utils/timeOptions";
import SegmentedControl from "./SegmentedControl";
import TopCommunitiesStatusBar from "./TopCommunitiesStatusBar";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../static/HomeIcon";

const NUM_TOP_COMMUNITIES = 6;

const columnClasses: { [key: number]: string } = {
  1: "lg:columns-1",
  2: "lg:columns-2",
  3: "lg:columns-3",
  4: "lg:columns-4",
  5: "lg:columns-5",
};

export interface UserPostProps {
  username: string;
}

const UserPost: React.FC<UserPostProps> = memo(({ username }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Post[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [numColumns, setNumColumns] = useState(3);
  const [postTypeFilter, setPostTypeFilter] = useState<string>("all");
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const filteredPosts = useMemo(() => {
    if (activeTab === "comments") return comments;
    if (postTypeFilter === "all") {
      return posts;
    }
    return posts.filter((post) => getPostType(post) === postTypeFilter);
  }, [posts, comments, postTypeFilter, activeTab]);

  const topCommunities = useMemo(() => {
    const communityCounts: { [key: string]: number } = {};

    [...posts, ...comments].forEach((item) => {
      if (item.subreddit) {
        communityCounts[item.subreddit] = (communityCounts[item.subreddit] || 0) + 1;
      }
    });

    const sortedCommunities = Object.entries(communityCounts).sort(([, countA], [, countB]) => countB - countA);
    return sortedCommunities.slice(0, NUM_TOP_COMMUNITIES);
  }, [posts, comments]);

  const fetchPosts = useCallback(() => {
    if (!hasMore) return;

    RedditApiClient.fetch(`https://www.reddit.com/user/${username}/submitted.json?sr_detail=true&after=${after}`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map((child: { data: Post }) => child.data);
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setAfter(data.data.after);
        setHasMore(!!data.data.after);
      });
  }, [username, after, hasMore]);

  const fetchComments = useCallback(() => {
    RedditApiClient.fetch(`https://www.reddit.com/user/${username}/comments.json?sr_detail=true&limit=100`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedComments = data.data.children.map((child: { data: Post }) => child.data);
        setComments(fetchedComments);
      });
  }, [username]);

  useEffect(() => {
    fetchComments();

    RedditApiClient.fetch(`https://www.reddit.com/user/${username}/about.json`)
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data.data);
      });
  }, [username]);

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
    <div className="dark:bg-custom-black dark:text-white">
      <div className="max-w-[95vw] mx-auto relative py-2">
        <nav aria-label="Breadcrumb" className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate("/")} className="block transition hover:text-gray-700 mr-2">
              <span className="sr-only">Home</span>
              <HomeIcon />
            </button>
            <span className="mr-2 text-lg font-bold text-gray-500">u/{username}</span>
          </div>
          <div className="ml-auto">
            <SearchInput />
          </div>
        </nav>
        {userProfile && (
          <div className="my-2">
            <UserKarma
              icon_img={userProfile.icon_img}
              total_karma={userProfile.total_karma}
              comment_karma={userProfile.comment_karma}
            />
          </div>
        )}

        <div className="flex space-x-2 mb-4">
          {(["posts", "comments"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1 px-3 font-semibold text-sm rounded ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "posts" && (
          <div className="flex items-center overflow-x-auto hide-scrollbar mb-2">
            <label className="mr-2 font-medium text-xs text-gray-700 dark:text-gray-300">Post Type</label>
            <SegmentedControl
              options={postTypeOptions}
              currentValue={postTypeFilter}
              onChange={(value) => setPostTypeFilter(value)}
              label="Post Type"
            />
          </div>
        )}

        <div className="hidden md:flex items-center gap-2.5 shrink-0 m-4 w-full justify-start">
          <label htmlFor="columns" className="text-[11px] font-medium text-zinc-600 uppercase tracking-wide">
            Cols
          </label>
          <input
            id="columns"
            type="range"
            min="1"
            max="5"
            value={numColumns}
            onChange={(e) => setNumColumns(Number(e.target.value))}
            className="w-20 h-0.75 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(96,165,250,0.5)]"
          />
          <span className="text-xs font-mono text-zinc-400 w-4 text-center tabular-nums">{numColumns}</span>
        </div>

        <div className={`columns-1 ${columnClasses[numColumns]} gap-4`}>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-200 dark:bg-neutral-800 shadow-md rounded-xl p-2 mb-4 w-full mx-auto prose prose-sm text-gray-700 dark:text-gray-300 prose-headings:font-semibold prose-headings:text-xl break-inside-avoid"
            >
              {activeTab === "comments" ? (
                <div>
                  <a href={`/r/${post.subreddit}`}>
                    <div className="inline-flex items-center gap-2 w-fit my-1">
                      <img
                        src={
                          post.sr_detail?.community_icon && post.sr_detail.community_icon.length > 1
                            ? post.sr_detail.community_icon.replace(/&amp;/g, "&")
                            : post.sr_detail?.icon_img && post.sr_detail.icon_img.length > 1
                              ? post.sr_detail.icon_img.replace(/&amp;/g, "&")
                              : post.sr_detail?.header_img && post.sr_detail.header_img.length > 1
                                ? post.sr_detail.header_img.replace(/&amp;/g, "&")
                                : "/fallback_reddit_icon.png"
                        }
                        className="w-6 h-6 rounded-full"
                      />
                    </div>
                    <span className="whitespace-nowrap rounded-lg text-blue-500 p-1 text-sm max-w-[95vw] overflow-x-auto inline-block font-bold">
                      {post.subreddit_name_prefixed}
                    </span>
                    <div className="flex items-center space-x-2 mb-2">
                      <CreatedEditedLabel created={post.created} edited={post.edited} />
                    </div>
                  </a>
                  <a href={`${post.permalink}`} className="block mt-2 group">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-300 p-1.5 bg-slate-300 dark:bg-slate-800 rounded-md">
                      {he.decode(post.link_title ?? post.link_permalink ?? "")}
                    </p>
                    {post.body_html && <BodyHtml body_html={post.body_html} />}
                    {post.selftext_html && <SelfTextHtml selftext_html={post.selftext_html} />}
                    <PostStats score={post.score} num_comments={0} />{" "}
                  </a>
                </div>
              ) : (
                <div>
                  {activeTab === "posts" && (
                    <a href={`/r/${post.subreddit}`}>
                      <div className="inline-flex items-center gap-2 p-1 w-fit my-1">
                        <img
                          src={
                            post.sr_detail?.community_icon && post.sr_detail.community_icon.length > 1
                              ? post.sr_detail.community_icon.replace(/&amp;/g, "&")
                              : post.sr_detail?.icon_img && post.sr_detail.icon_img.length > 1
                                ? post.sr_detail.icon_img.replace(/&amp;/g, "&")
                                : post.sr_detail?.header_img && post.sr_detail.header_img.length > 1
                                  ? post.sr_detail.header_img.replace(/&amp;/g, "&")
                                  : "/fallback_reddit_icon.png"
                          }
                          className="w-6 h-6 rounded-full"
                        />
                      </div>
                      <span className="whitespace-nowrap rounded-lg text-blue-500 p-1 text-sm max-w-[95vw] overflow-x-auto inline-block font-bold">
                        {post.subreddit_name_prefixed}
                      </span>
                    </a>
                  )}
                  <CreatedEditedLabel created={post.created} edited={post.edited} />
                  <a href={`${post.permalink ?? post.link_permalink}`} className="block mt-2 group">
                    <h2 className="text-lg font-bold dark:text-white group-hover:underline">
                      {he.decode(post.title ?? "")}
                    </h2>
                    {post.link_title && (
                      <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-1.5 border border-gray-300 dark:border-gray-700 text-sm">
                        <h1 className="text-md font-medium text-gray-900 dark:text-white">{post.link_title}</h1>
                      </div>
                    )}

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
                          {post.gallery_data && (
                            <PostGallery galleryData={post.gallery_data} mediaMetadata={post.media_metadata} />
                          )}
                        </div>
                      ) : post.preview ? (
                        <PostPreview preview={post.preview} />
                      ) : post.url_overridden_by_dest ? (
                        isImage(post.url_overridden_by_dest) ? (
                          <img
                            src={post.url_overridden_by_dest}
                            alt="url_overridden_by_dest"
                            className="mt-4 flex justify-center items-center max-w-full max-h-125 mx-auto border rounded-sm p-2 object-contain"
                          />
                        ) : (
                          <FetchImage url={post.url_overridden_by_dest} />
                        )
                      ) : (
                        <Thumbnail thumbnail={post.thumbnail || ""} />
                      )}
                      {post.body_html && <BodyHtml body_html={post.body_html} />}
                      {post.poll_data && <PollData poll_data={post.poll_data} />}
                      {post.selftext_html && <SelfTextHtml selftext_html={post.selftext_html} />}
                      <PostStats score={post.score} num_comments={post.num_comments} />
                    </div>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        <div ref={sentinel} className="h-1"></div>
        <TopCommunitiesStatusBar topCommunities={topCommunities} />
      </div>
    </div>
  );
});

export default UserPost;
