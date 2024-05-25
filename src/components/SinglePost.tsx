import { useEffect, useState } from "react";
import he from "he";
import Slider from "react-slick";
import { parseUnixTimestamp } from "../utils/datetime";
import { Post } from "../types/post";
import { Comment, Children2 } from "../types/comment";
import { isImage, parseImageType } from "../utils/parser";
import CustomTag from "./CustomTag";
import AuthorFlairText from "./AuthorFlairText";
import LinkFlairText from "./LinkFlairText";
import SearchInput from "./SearchInput";
import { FetchImage } from "../utils/image";

const CommentComponent = ({
  comment,
  postAuthor,
}: {
  comment: Comment;
  postAuthor: string;
}) => {
  if (!comment?.body_html) return null;

  const decodedBodyHtml = he.decode(comment.body_html.replace(/\n\n/g, "<br>"));

  return (
    <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-4 hover:bg-slate-100 lg:hover:bg-transparent px-1 rounded-md">
      <div className="flex justify-between items-center w-full max-w-[100vw]">
        <div className="flex items-center space-x-2 overflow-hidden">
          <a href={`/user/${comment.author}`}>
            <h3 className="font-semibold">{comment.author}</h3>
          </a>
          {comment.author === postAuthor && (
            <span className="whitespace-nowrap rounded-lg bg-blue-100 p-1 font-semibold text-sm text-blue-700 overflow-x-auto">
              OP
            </span>
          )}
          <AuthorFlairText
            author_flair_richtext={comment.author_flair_richtext}
            author_flair_text={comment.author_flair_text}
            author_flair_background_color={
              comment.author_flair_background_color
            }
          />
        </div>
        <h3 className="text-sm whitespace-nowrap ml-1">
          🕔 {parseUnixTimestamp(comment.created_utc)}
        </h3>
      </div>
      <div
        className="mt-1 text-md text-gray-700 overflow-auto"
        dangerouslySetInnerHTML={{ __html: decodedBodyHtml }}
      />
      <div className="text-gray-500 text-sm mt-2">
        🔼 {comment.score || 0} upvotes
      </div>
      {comment.replies?.data?.children?.map((childWrapper: Children2) => {
        const child = childWrapper.data;
        return child ? (
          <div key={child.id} className="ml-3 md:ml-4 lg:ml-5 mt-4">
            <CommentComponent comment={child} postAuthor={postAuthor} />
          </div>
        ) : null;
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
        const [postList, commentList] = data;
        setPosts(
          postList.data.children.map((child: { data: Post }) => child.data)
        );
        setComments(
          commentList.data.children.map(
            (child: { data: Comment }) => child.data
          )
        );
      });
  }, [subreddit, postId, title]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="mx-auto md:w-8/12 xl:w-1/2 max-w-[90vw] flex flex-col justify-center relative py-4">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center justify-between mb-5"
      >
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a 1 0 010 1.414l-4 4a1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>
          <li>
            <a
              href={`/r/${subreddit}`}
              className="flex h-8 items-center bg-white text-gray-500 text-lg font-bold"
            >
              {subreddit}
            </a>
          </li>
        </ol>
        <div className="search-input">
          <SearchInput />
        </div>
      </nav>

      {posts.map((post) => (
        <div
          key={post.id}
          className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-8"
        >
          <div className="flex items-center space-x-2">
            <a href={`/user/${post.author}`}>
              <h3 className="font-semibold">{post.author}</h3>
            </a>
            <AuthorFlairText
              author_flair_richtext={post.author_flair_richtext}
              author_flair_text={post.author_flair_text}
              author_flair_background_color={post.author_flair_background_color}
            />
          </div>
          <a href={`${post.url_overridden_by_dest ?? post.url}`}>
            <h3 className="text-sm">🕔 {parseUnixTimestamp(post.created)}</h3>
            <h2 className="text-2xl my-2 font-semibold">
              {he.decode(post.title)}
            </h2>
            <LinkFlairText
              link_flair_richtext={post.link_flair_richtext}
              link_flair_text={post.link_flair_text}
              link_flair_background_color={post.link_flair_background_color}
            />
            {post.secure_media_embed?.media_domain_url ? (
              <div
                className="mt-4 aspect-auto flex justify-center items-center max-w-full"
                style={{
                  width: `${post.secure_media_embed.width}px`,
                  height: `${post.secure_media_embed.height}px`,
                }}
              >
                <iframe
                  src={post.secure_media_embed.media_domain_url}
                  allowFullScreen
                  className="w-full h-full aspect-auto"
                ></iframe>
              </div>
            ) : post.secure_media ? (
              <div
                className="mt-4 aspect-auto flex justify-center items-center max-w-full"
                style={{
                  width: `${post.secure_media.reddit_video.width}px`,
                  height: `${post.secure_media.reddit_video.height}px`,
                }}
              >
                <iframe
                  src={post.secure_media.reddit_video.fallback_url}
                  allowFullScreen
                  className="w-full h-full aspect-auto"
                ></iframe>
              </div>
            ) : post.media_metadata ? (
              <div className="relative mt-2">
                {post.gallery_data ? (
                  <Slider {...settings} className="mb-8">
                    {post.gallery_data.items.map((item) => (
                      <div
                        key={item.media_id}
                        className="h-full w-full flex items-center z-50"
                      >
                        <img
                          src={`https://i.redd.it/${
                            item.media_id
                          }.${parseImageType(
                            post.media_metadata?.[
                              item.media_id as unknown as number
                            ]?.m ?? ""
                          )}`}
                          className="relative rounded-lg overflow-hidden w-full h-auto block mt-2"
                          alt="Gallery Image"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={`https://i.redd.it/${
                      Object.keys(post.media_metadata)[0]
                    }.${parseImageType(
                      post.media_metadata[
                        Object.keys(post.media_metadata)[0] as unknown as number
                      ]?.m
                    )}`}
                    className="relative rounded-md overflow-hidden xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
                    alt="Image"
                  />
                )}
              </div>
            ) : post.preview &&
              post.preview.images &&
              post.preview.images[0].resolutions.length > 0 ? (
              <div className="relative mt-2">
                <img
                  src={post.preview.images[0].source.url.replace(/&amp;/g, "&")}
                  alt="source_url"
                  className="relative rounded-md overflow-hidden xs:h-[100px] xs:w-[130px] max-w-[90vw] w-96 h-auto block mt-2"
                />
              </div>
            ) : post.url_overridden_by_dest ? (
              isImage(post.url_overridden_by_dest) ? (
                <img
                  src={post.url_overridden_by_dest}
                  alt="url_overridden_by_dest"
                  className="relative rounded-md overflow-hidden xs:w-[184px] w-[284px] block mt-2"
                />
              ) : (
                <FetchImage url={post.url_overridden_by_dest} />
              )
            ) : !(
                post.thumbnail === "self" ||
                post.thumbnail === "default" ||
                post.thumbnail === "spoiler" ||
                post.thumbnail === ""
              ) ? (
              post.thumbnail === "nsfw" ? (
                <CustomTag
                  fontSize="text-xs"
                  color="text-white"
                  backgroundColor="bg-red-500"
                  content="🔞 NSFW"
                />
              ) : (
                <img
                  src={post.thumbnail}
                  alt="thumbnail"
                  className="relative rounded-md overflow-hidden xs:w-[184px] w-[284px] block mt-2"
                />
              )
            ) : null}
            {post.selftext_html && (
              <div
                className="mt-1 text-md text-gray-700 overflow-scroll"
                dangerouslySetInnerHTML={{
                  __html: he.decode(
                    post.selftext_html.replace(/\n\n/g, "<br>")
                  ),
                }}
              />
            )}
          </a>
          <div className="text-gray-500 text-sm mt-2">
            🔼 {post.score} upvotes 💬 {post.num_comments} comments
          </div>
        </div>
      ))}

      {comments.map((comment) => (
        <CommentComponent
          key={comment.id}
          comment={comment}
          postAuthor={posts[0].author}
        />
      ))}
    </div>
  );
};

export default SinglePost;
