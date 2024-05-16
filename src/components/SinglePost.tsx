import { useEffect, useState } from "react";
import he from "he";
import { parseUnixTimestamp } from "../utils/datetime";
import { Post } from "../types/post";
import { Comment, Children2 } from "../types/comment";
import { isImage, parseImageType } from "../utils/parser";
import NSFWTag from "./NSFWTag";

const CommentComponent = ({ comment }: { comment: Comment }) => {
  if (!comment) return null;
  if (!comment.body_html) return null;

  return (
    <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{comment.author || "Unknown Author"}</h3>
        <h3 className="text-sm">
          🕔 {parseUnixTimestamp(comment.created_utc)}
        </h3>
      </div>
      <div
        className="mt-1 text-md text-gray-700 overflow-auto"
        dangerouslySetInnerHTML={{
          __html: he.decode(comment.body_html.replace(/\n\n/g, '<br>')),
        }}
      />
      <div className="text-gray-500 text-sm mt-2">
        🔼 {comment.score || 0} upvotes
      </div>

      {comment.replies?.data?.children?.map((childWrapper: Children2) => {
        const child = childWrapper.data;
        if (!child) return null;

        return (
          <div key={child.id} className="ml-3 md:ml-4 lg:ml-5 mt-4">
            <CommentComponent comment={child} />
          </div>
        );
      })}
    </div>
  );
};

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

        setPosts(fetchedPosts);
        setComments(fetchedComments);
      });
  }, [subreddit, postId, title]);

  return (
    <div className="mx-auto md:w-8/12 xl:w-1/2 max-w-[90vw] flex flex-col justify-center relative py-4">
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex items-center gap-1 text-sm text-gray-600">
          <li>
            <a href="/" className="block transition hover:text-gray-700">
              <span className="sr-only">Home</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </a>
          </li>

          <li className="rtl:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </li>

          <li>
            <a
              href={`/${subreddit}`}
              className="flex h-8 items-center bg-white text-gray-500 text-lg font-bold"
            >
              {subreddit}
            </a>
          </li>
        </ol>
      </nav>

      {posts.map((post) => (
        <a href={`https://www.reddit.com${post.permalink}`} key={post.id}>
          <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-10">
            <h3 className="font-semibold">{post.author}</h3>
            <h3 className="text-sm">🕔 {parseUnixTimestamp(post.created)}</h3>
            <h2 className="text-2xl my-2 font-semibold">
              {he.decode(post.title)}
            </h2>

            {post.link_flair_text && (
              <span className="whitespace-nowrap rounded-lg bg-purple-100 px-2 py-1 text-sm text-purple-700 max-w-[90vw] overflow-x-auto display: inline-block">
                {post.link_flair_text}
              </span>
            )}
            {post.media_metadata ? (
              <div>
                <div className="relative mt-2">
                  <img
                    src={`https://i.redd.it/${
                      Object.keys(post.media_metadata)[0]
                    }.${parseImageType(
                      post.media_metadata[
                        Object.keys(post.media_metadata)[0] as unknown as number
                      ]?.m
                    )}`}
                    className="relative rounded-[8px] overflow-hidden box-border border border-solid border-neutral-border-weak xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
                    alt="Image"
                  />
                </div>
              </div>
            ) : post.url_overridden_by_dest && isImage(post.url_overridden_by_dest) ? (
              <img
                src={post.url_overridden_by_dest}
                alt="url_overridden_by_dest"
                className="relative rounded-[8px] overflow-hidden box-border border border-solid border-neutral-border-weak xs:w-[184px] w-[284px] block mt-2"
              />
            ) : !(post.thumbnail === "self" || post.thumbnail === "default" || post.thumbnail === "") ? (
              post.thumbnail === "nsfw" ? (
                <NSFWTag />
              ) : (
                <img
                  src={post.thumbnail}
                  alt="thumbnail"
                  className="relative rounded-[8px] overflow-hidden box-border border border-solid border-neutral-border-weak xs:w-[184px] w-[284px] block mt-2"
                />
              )
            ) : null }
            {post.selftext_html && (
              <div
                className="mt-1 text-md text-gray-700 overflow-scroll"
                dangerouslySetInnerHTML={{
                  __html: he.decode(post.selftext_html.replace(/\n\n/g, '<br>')),
                }}
              />
            )}
            <div className="text-gray-500 text-sm mt-2">
              🔼 {post.score} upvotes 💬 {post.num_comments} comments
            </div>
          </div>
        </a>
      ))}

      {comments.map((comment) => (
        <CommentComponent key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default SinglePost;
