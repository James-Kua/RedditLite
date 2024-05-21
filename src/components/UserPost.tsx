import { useEffect, useState, useRef, useCallback } from "react";
import { User } from "../types/user";
import { parseUnixTimestamp } from "../utils/datetime";
import he from "he";

const UserPost = ({ username }: { username: string }) => {
  const [posts, setPosts] = useState<User[]>([]);
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
      </nav>
      {posts.map((post) => (
        <div key={post.id} className="mb-8">
          <a
            href={`/${post.subreddit}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            <span className="whitespace-nowrap rounded-lg bg-purple-100 px-2 py-1 text-sm text-purple-700 max-w-[90vw] overflow-x-auto display: inline-block">
              {post.subreddit_name_prefixed}
            </span>
          </a>
          <h3 className="text-sm my-1">
            🕔 {parseUnixTimestamp(post.created)}
          </h3>
          <a
            href={`/${
              post.link_permalink
                ? post.link_permalink.split("/r/")[1]
                : post.permalink.split("/r/")[1]
            }`}
          >
            <h1 className="text-xl font-medium text-gray-800">{post.title}</h1>
            {post.link_title && (
              <div className="bg-gray-100 rounded-lg py-2 pl-2">
                <h1 className="text-md font-medium text-gray-600">
                  {post.link_title}
                </h1>
              </div>
            )}

            {post.body_html && (
              <div
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.body_html.replace(/\n\n/g, "<br>")),
                }}
                className="mt-2 overflow-scroll"
              />
            )}
            {post.selftext && (
              <div
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.selftext.replace(/\n/g, "<br>")),
                }}
                className="mt-2 overflow-scroll"
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
