import { useEffect, useState, useRef, useCallback, memo } from "react";
import { UserProfile } from "../types/user";
import { Post } from "../types/post";
import he from "he";
import { FetchImage } from "../utils/image";
import { isImage } from "../utils/parser";
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

export interface UserPostProps {
  username: string;
}

const UserPost: React.FC<UserPostProps> = memo(({ username }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Post[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(() => {
    if (!hasMore) return;

    RedditApiClient.fetch(`https://www.reddit.com/user/${username}/submitted.json?after=${after}`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map(
          (child: { data: Post }) => child.data
        );
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
      <div className="mx-auto md:w-8/12 xl:w-1/2 max-w-[90vw] flex flex-col justify-center relative py-4">
        <nav aria-label="Breadcrumb" className="mb-5">
          <div className="flex h-8 items-center text-gray-500">
            <span className="mr-2 text-lg font-bold">u/{username}</span>
            <div className="ml-auto">
              <SearchInput />
            </div>
          </div>
          {userProfile && (
            <div className="mt-2">
              <UserKarma
                iconImg={userProfile.icon_img}
                total_karma={userProfile.total_karma}
                comment_karma={userProfile.comment_karma}
              />
            </div>
          )}
        </nav>

        <div className="flex space-x-2 mb-4">
          <button onClick={() => setActiveTab('posts')} className={`py-1 px-3 font-semibold text-sm rounded ${activeTab === 'posts' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            Posts
          </button>
          <button onClick={() => setActiveTab('comments')} className={`py-1 px-3 font-semibold text-sm rounded ${activeTab === 'comments' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            Comments
          </button>
        </div>

        {activeTab === 'posts' ? (
          posts.map((post) => (
            <div key={post.id} className="mb-6">
              <CreatedEditedLabel
                created={post.created_utc}
                edited={post.edited}
              />
              <a href={`/r/${post.subreddit}`}>
                <span className="whitespace-nowrap rounded-lg bg-slate-100 dark:bg-slate-800 p-1 my-1 text-sm text-blue-500 max-w-[90vw] overflow-x-auto display: inline-block font-bold">
                  {post.subreddit_name_prefixed}
                </span>
              </a>

              <a href={`${post.permalink ?? post.link_permalink}`}>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{he.decode(post.title ?? "")}</h1>
                {post.link_title && (
                  <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-1.5 border border-gray-300 dark:border-gray-700 text-sm">
                    <h1 className="text-md font-medium text-gray-900 dark:text-white">{post.link_title}</h1>
                  </div>
                )}

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
                      <PostGallery
                        galleryData={post.gallery_data}
                        mediaMetadata={post.media_metadata}
                      />
                    ) : null}
                  </div>
                ) : post.preview ? (
                  <PostPreview preview={post.preview} />
                ) : post.url_overridden_by_dest ? (
                  isImage(post.url_overridden_by_dest) ? (
                    <img
                      src={post.url_overridden_by_dest}
                      alt="url_overridden_by_dest"
                      className="mt-4 flex justify-center items-center max-w-full max-h-[500px] mx-auto border rounded-sm p-2 object-contain"
                    />
                  ) : (
                    <FetchImage url={post.url_overridden_by_dest} />
                  )
                ) : (
                  <Thumbnail thumbnail={post.thumbnail || ""} />
                )}
                {post.body_html && <BodyHtml body_html={post.body_html} />}
                {post.poll_data && (
                  <PollData poll_data={post.poll_data} />
                )}
                {post.selftext_html && <SelfTextHtml selftext_html={post.selftext_html} />}
                <PostStats score={post.score} />
              </a>
            </div>
          ))
        ) : (
          comments.map((post) => (
            <div key={post.id} className="mb-6">
              <CreatedEditedLabel
                created={post.created_utc}
                edited={post.edited}
              />
              <a href={`/r/${post.subreddit}`}>
                <span className="whitespace-nowrap rounded-lg bg-slate-100 dark:bg-slate-800 p-1 my-1 text-sm text-blue-500 max-w-[90vw] overflow-x-auto display: inline-block font-bold">
                  {post.subreddit_name_prefixed}
                </span>
              </a>

              <a href={`${post.permalink ?? post.link_permalink}`}>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{he.decode(post.title ?? "")}</h1>
                {post.link_title && (
                  <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-1.5 border border-gray-300 dark:border-gray-700 text-sm">
                    <h1 className="text-md font-medium text-gray-900 dark:text-white">{post.link_title}</h1>
                  </div>
                )}

                {post.url_overridden_by_dest &&
                  (isImage(post.url_overridden_by_dest) ? (
                    <img
                      src={post.url_overridden_by_dest}
                      alt="url_overridden_by_dest"
                      className="mt-4 flex justify-center items-center max-w-full max-h-[500px] mx-auto border rounded-sm p-2 object-contain"
                    />
                  ) : (
                    <FetchImage url={post.url_overridden_by_dest} />
                  ))}
                {post.body_html && <BodyHtml body_html={post.body_html} />}
                {post.gallery_data && (
                  <PostGallery galleryData={post.gallery_data} mediaMetadata={post.media_metadata} />
                )}
                {post.poll_data && (
                  <PollData poll_data={post.poll_data} />
                )}
                {post.selftext_html && <SelfTextHtml selftext_html={post.selftext_html} />}
                <PostStats score={post.score} />
              </a>
            </div>
          ))
        )}
        <div ref={sentinel} className="h-1"></div>
      </div>
    </div>
  );
});

export default UserPost;
