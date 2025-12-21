import React, { useEffect, useState } from "react";
import { Comment, Children2 } from "../types/comment";
import AuthorFlairText from "./AuthorFlairText";
import BodyHtml from "./BodyHtml";
import CreatedEditedLabel from "./CreatedEditedLabel";
import UpvoteIcon from "../static/UpvoteIcon";

const filterComments = (comments: Comment[], searchTerm: string): Comment[] => {
  return comments
    .map((comment) => {
      if (!comment.body_html) {
        return null;
      }

      if (comment.body_html.toLowerCase().includes(searchTerm)) {
        return comment;
      }

      if (comment.replies?.data?.children?.length > 0) {
        const filteredReplies = filterComments(
          comment.replies.data.children.map((child: Children2) => child.data),
          searchTerm
        );
        if (filteredReplies.length > 0) {
          return {
            ...comment,
            replies: {
              data: {
                children: filteredReplies.map((reply) => ({ data: reply })),
              },
            },
          };
        }
      }
      return null;
    })
    .filter(Boolean) as Comment[];
};

export type CommentProps = {
  comment: Comment;
  postAuthor: string;
};

const SingleComment: React.FC<CommentProps> = ({ comment, postAuthor }) => {
  const [showReplies, setShowReplies] = useState(true);

  useEffect(() => {
    if (comment.collapsed) {
      setShowReplies(false);
    }
  }, [comment.collapsed]);

  if (!comment?.body_html) return null;

  return (
    <div className="bg-slate-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 rounded-lg pl-2 mr-1 pt-1 mb-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center flex-wrap gap-2 overflow-hidden">
          <img
            src={comment.profile_img?.length ? comment.profile_img?.replace(/&amp;/g, "&") : ""}
            alt={comment.author}
            className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600"
          />
          <a href={`/user/${comment.author}`} className="flex items-center space-x-1">
            <h3 className="font-semibold text-sm text-blue-500 whitespace-nowrap hover:underline">{comment.author}</h3>
            {comment?.distinguished === "moderator" && (
              <span className="text-green-500 text-xs font-semibold">MOD</span>
            )}
          </a>
          {comment.author === postAuthor && (
            <span className="rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1 py-0.5 text-xs font-semibold">
              OP
            </span>
          )}
          <AuthorFlairText
            author_flair_richtext={comment.author_flair_richtext}
            author_flair_text={comment.author_flair_text}
            author_flair_background_color={comment.author_flair_background_color}
          />
          <CreatedEditedLabel created={comment.created} edited={comment.edited} />
        </div>
      </div>

      <div className="mt-2">
        <BodyHtml body_html={comment.body_html} />
      </div>

      <div className="text-gray-600 dark:text-gray-300 text-xs mt-2 flex items-center space-x-1">
        <UpvoteIcon />
        <span className="font-medium">{comment.score.toLocaleString("en-US")}</span>
        <span>{comment.score === 1 ? "upvote" : "upvotes"}</span>
      </div>

      {comment.replies?.data?.children?.length > 0 && (
        <button
          className="text-xs text-blue-500 mt-2 focus:outline-none"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? "➖ Hide Replies" : "➕ Show Replies"}
        </button>
      )}

      {showReplies && (
        <div className="relative border-l-[0.5px] border-gray-700 pl-1 lg:pl-3 ml-0 mb-2">
          {comment.replies?.data?.children?.map((childWrapper: Children2) => {
            const child = childWrapper.data;
            return child ? (
              <SingleComment key={child.id} comment={child} postAuthor={postAuthor} />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export type CommentsComponentProps = {
  comments: Comment[];
  postAuthor: string;
  searchTerm: string;
};

const CommentsComponent: React.FC<CommentsComponentProps> = ({ comments, postAuthor, searchTerm }) => {
  const filteredComments = filterComments(comments, searchTerm);

  return (
    <>
      {filteredComments.map((comment) => (
        <SingleComment key={comment.id} comment={comment} postAuthor={postAuthor} />
      ))}
    </>
  );
};

export default CommentsComponent;
