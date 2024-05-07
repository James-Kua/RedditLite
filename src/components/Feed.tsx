import { useEffect, useState } from "react";
import he from "he";
import SearchInput from "./SearchInput";

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
  url_overridden_by_dest: string;
  thumbnail?: string;
  media_metadata?: [];
  score: number;
}

function parsePermalink(permalink: string) {
  const parts = permalink.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return `/${parts.slice(1).join("/")}`;
  }

  return permalink;
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
    <div className="w-full max-w-[90vw] mx-auto 2xl:max-w-7xl flex flex-col justify-center relative lg:p-8">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-gray-500 font-bold text-4xl mr-1">{subreddit}</h1>
        <div>
          <SearchInput />
        </div>
      </div>
      {posts.map((post) => (
        <a href={parsePermalink(post.permalink)} key={post.id}>
          <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-10">
            <h3>{post.author}</h3>
            <h2 className="text-xl font-semibold my-1">{post.title}</h2>
            {post.link_flair_text && (
              <span className="whitespace-nowrap rounded-lg bg-purple-100 px-2 py-1 text-sm text-purple-700">
                {post.link_flair_text}
              </span>
            )}

            {post.media_metadata ? (
              <div>
                <div className="relative mt-2">
                  <img
                    src={`https://i.redd.it/${
                      Object.keys(post.media_metadata)[0]
                    }.jpg`}
                    className="relative rounded-[8px] overflow-hidden box-border border border-solid border-neutral-border-weak xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
                    alt="Image"
                  />
                </div>
              </div>
            ) : post.thumbnail !== "self" && post.thumbnail !== "default" ? (
              <img
                src={post.thumbnail}
                alt="thumbnail"
                className="relative rounded-[8px] overflow-hidden box-border border border-solid border-neutral-border-weak xs:h-[100px] xs:w-[150px] w-[184px] block mt-2"
              />
            ) : post.url_overridden_by_dest &&
              post.url_overridden_by_dest.endsWith(".jpg") ? (
              <img
                src={post.url_overridden_by_dest}
                alt="url_overridden_by_dest"
                className="relative rounded-[8px] overflow-hidden box-border border border-solid border-neutral-border-weak xs:h-[100px] xs:w-[150px] w-[184px] block mt-2"
              />
            ) : null}
            {post.selftext_html && (
              <div
                className="mt-1 text-md text-gray-700 overflow-scroll"
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.selftext_html),
                }}
              />
            )}
            {
              <div className="text-gray-500 text-sm mt-2">
                🔼 {post.score} upvotes
              </div>
            }
          </div>
        </a>
      ))}
    </div>
  );
};

export default Feed;
