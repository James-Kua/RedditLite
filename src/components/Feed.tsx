import { useEffect, useState } from "react";
import he from "he";

interface FeedProps {
  subreddit: string;
}

interface Post {
  id: string;
  author: string;
  title: string;
  selftext_html?: string;
  permalink: string;
  link_flair_text?: string;
}

const Feed: React.FC<FeedProps> = ({ subreddit }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const cacheKey = `reddit_${subreddit}`;

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setPosts(parsedData);
    } else {
      fetch(`https://www.reddit.com/r/${subreddit}.json`)
        .then((response) => response.json())
        .then((data) => {
          const fetchedPosts = data.data.children.map(
            (child: { data: Post }) => child.data
          );
          setPosts(fetchedPosts);
          localStorage.setItem(cacheKey, JSON.stringify(fetchedPosts));
        });
    }
  }, [subreddit]);

  return (
    <div className="w-full max-w-[90vw] mx-auto 2xl:max-w-7xl flex flex-col justify-center relative lg:p-8">
      <h1 className="text-gray-500 font-bold text-4xl mb-5">{subreddit}</h1>
      {posts.map((post) => (
        <a
          href={`/${subreddit}/comments/${post.id}/${post.title}`}
          key={post.id}
        >
          <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-10">
            <h3>{post.author}</h3>
            <h2 className="text-xl font-semibold my-1">{post.title}</h2>
            {post.link_flair_text && (
              <span className="whitespace-nowrap rounded-lg bg-purple-100 px-2 py-1 text-sm text-purple-700">
                {post.link_flair_text}
              </span>
            )}
            {post.selftext_html && (
              <div
                className="mt-1 text-md text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.selftext_html),
                }}
              />
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

export default Feed;
