import { useEffect, useState } from "react";
import he from "he";
import { parseUnixTimestamp } from "../utils/datetime";

interface Post {
  id: string;
  author: string;
  created: number;
  title: string;
  selftext_html?: string;
  permalink: string;
  link_flair_text?: string;
  score: number;
  num_comments: number;
}

interface Comment {
  id: string;
  body_html: string;
  author: string;
  author_fullname: string;
  created: number;
  permalink: string;
  score: number;
  created_utc: number;
  parent_id: string;
  author_flair_text?: string;
  media_metadata: [];
}

const SinglePost = ({
  subreddit,
  postId,
  title,
}: {
  subreddit: string;
  postId: string;
  title: string;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [mediaMetadata, setMediaMetadata] = useState<any>({});

  useEffect(() => {
    fetch(
      `https://www.reddit.com/r/${subreddit}/comments/${postId}/${title}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        const fetchedPosts = data[0].data.children.map(
          (child: { data: Post }) => child.data
        );

        const fetchedComments = data[1].data.children.map(
          (child: { data: Comment }) => child.data
        );

        const mediaMetadata = fetchedPosts[0]?.media_metadata || {};

        setPosts(fetchedPosts);
        setComments(fetchedComments);
        setMediaMetadata(mediaMetadata);
      });
  }, [subreddit, postId, title]);

  return (
    <div className="w-full mx-auto 2xl:max-w-4xl flex flex-col justify-center relative p-8">
      <nav aria-label="Breadcrumb" className="flex justify-between mb-5">
        <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600">
          <li className="flex items-center">
            <a
              href="/"
              className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="ms-1.5 text-xs font-medium">Home</span>
            </a>
          </li>
          <li className="relative flex items-center">
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180"></span>
            <a
              href={`/${subreddit}`}
              className="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium transition hover:text-gray-900"
            >
              {subreddit}
            </a>
          </li>
        </ol>
      </nav>

      {posts.map((post) => (
        <a href={`https://www.reddit.com${post.permalink}`} key={post.id}>
          <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-10">
            <h3>{post.author}</h3>
            <h3 className="text-sm">🕔 {parseUnixTimestamp(post.created)}</h3>
            <h2 className="text-3xl my-2 font-semibold">{post.title}</h2>
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
            {
              <div className="text-gray-500 text-sm mt-2">
                🔼 {post.score} upvotes 💬 {post.num_comments} comments
              </div>
            }
          </div>
        </a>
      ))}

      {mediaMetadata && Object.keys(mediaMetadata).length > 0 && (
        <div className="w-full mb-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Object.keys(mediaMetadata).map((key) => (
              <div key={key} className="relative">
                <img
                  src={`https://i.redd.it/${key}.jpg`}
                  alt={`Media ${key}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-10"
        >
          <div className="flex justify-between items-center">
            <h3>{comment.author}</h3>
            <h3 className="text-sm">
              🕔 {parseUnixTimestamp(comment.created)}
            </h3>
          </div>
          <div
            className="mt-1 text-md text-gray-700"
            dangerouslySetInnerHTML={{
              __html: he.decode(comment.body_html),
            }}
          />
          <div className="text-gray-500 text-sm mt-2">
            🔼 {comment.score} upvotes
          </div>
        </div>
      ))}
    </div>
  );
};

export default SinglePost;
