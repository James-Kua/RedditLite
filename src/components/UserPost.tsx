import { useEffect, useState, useRef, useCallback } from "react";
import { User, UserProfile } from "../types/user";
import { parseUnixTimestamp } from "../utils/datetime";
import he from "he";
import { FetchImage } from "../utils/image";
import { isImage } from "../utils/parser";
import UserKarma from "./UserKarma";
import BodyHtml from "./BodyHtml";

const UserPost = ({ username }: { username: string }) => {
  const [posts, setPosts] = useState<User[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinel = useRef(null);

  const fetchPosts = useCallback(() => {
    if (!hasMore) return;

    fetch(`https://www.reddit.com/user/${username}.json?after=${after}`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map(
          (child: { data: User }) => child.data
        );
        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setAfter(data.data.after);
        setHasMore(!!data.data.after);
      });
  }, [username, after, hasMore]);

  useEffect(() => {
    fetch(`https://www.reddit.com/user/${username}.json`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map(
          (child: { data: User }) => child.data
        );
        setPosts(fetchedPosts);
        setAfter(data.data.after);
        setHasMore(!!data.data.after);
      });

    fetch(`https://www.reddit.com/user/${username}/about.json`)
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data.data);
      });
    console.log(userProfile);
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
    <div className="mx-auto md:w-8/12 xl:w-1/2 max-w-[90vw] flex flex-col justify-center relative py-4">
      <nav aria-label="Breadcrumb" className="mb-5">
        <div className="flex h-8 items-center bg-white text-gray-500 text-lg font-bold">
          u/{username}
        </div>
        {userProfile && (
          <div className="mt-2">
            <UserKarma
              iconImg={userProfile.icon_img}
              username={username}
              totalKarma={userProfile.total_karma}
              commentKarma={userProfile.comment_karma}
            />
          </div>
        )}
      </nav>
      {posts.map((post) => (
        <div key={post.id} className="mb-8">
          <a href={`/r/${post.subreddit}`} className="text-blue-500">
            <span className="whitespace-nowrap rounded-lg bg-slate-100 p-1 text-sm text-blue-500 max-w-[90vw] overflow-x-auto display: inline-block font-bold">
              {post.subreddit_name_prefixed}
            </span>
          </a>
          <h3 className="text-sm my-1">
            🕔 {parseUnixTimestamp(post.created)}
          </h3>
          <a
            href={`/r/${
              post.link_permalink
                ? post.link_permalink.split("/r/")[1]
                : post.permalink.split("/r/")[1]
            }`}
          >
            <h1 className="text-xl font-semibold text-gray-800">
              {he.decode(post.title ?? "")}
            </h1>
            {post.link_title && (
              <div className="bg-slate-100 rounded-md py-2 pl-2">
                <h1 className="text-md font-medium text-gray-800">
                  {post.link_title}
                </h1>
              </div>
            )}

            {post.url_overridden_by_dest &&
              (isImage(post.url_overridden_by_dest) ? (
                <img
                  src={post.url_overridden_by_dest}
                  alt="url_overridden_by_dest"
                  className="relative rounded-md overflow-hidden xs:w-[184px] w-[284px] block mt-2"
                />
              ) : (
                <FetchImage url={post.url_overridden_by_dest} />
              ))}

            {post.body_html && (
              <BodyHtml body_html={post.body_html} />
            )}
            {post.selftext && (
              <div
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.selftext.replace(/\n/g, "<br>")),
                }}
                className="mt-2 overflow-scroll text-gray-600"
              />
            )}
            <div className="text-gray-500 text-sm mt-2">
              🔼 {post.score} upvotes 💬 {post.num_comments} comments
            </div>
          </a>
        </div>
      ))}
      <div ref={sentinel} className="h-1"></div>
    </div>
  );
};

export default UserPost;
