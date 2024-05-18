import { useEffect, useState } from "react";
import { User } from "../types/user";
import { parseUnixTimestamp } from "../utils/datetime";
import he from "he";

const UserPost = ({ username }: { username: string }) => {
  const [posts, setPosts] = useState<User[]>([]);

  useEffect(() => {
    fetch(`https://www.reddit.com/user/${username}.json`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map(
          (child: { data: User }) => child.data
        );

        setPosts(fetchedPosts);
      });
  }, [username]);

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
            <h1 className="text-xl font-medium">{post.title}</h1>
            <h1 className="text-md font-medium">{post.link_title}</h1>
            {post.body_html && (
              <div
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.body_html.replace(/\n\n/g, "<br>")),
                }}
                className="mt-2"
              />
            )}
            {post.selftext && (
              <div
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.selftext.replace(/\n/g, "<br>")),
                }}
                className="mt-2"
              />
            )}
            <div className="text-gray-500 text-sm mt-2">
              🔼 {post.score} upvotes 💬 {post.num_comments} comments
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default UserPost;
