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

  useEffect(() => {
    fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data.data.children.map(
          (child: { data: Post }) => child.data
        );
        setPosts(fetchedPosts);
      });
  }, [subreddit]);

  return (
    <div className="w-full mx-auto 2xl:max-w-7xl flex flex-col justify-center py-24 relative p-8">
      {posts.map((post) => (
        <a href={`https://www.reddit.com${post.permalink}`} key={post.id}>
          <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-10">
            <h3>{post.author}</h3>
            <h2 className="text-3xl font-semibold">{post.title}</h2>
            {post.link_flair_text && (
              <span className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700">
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
