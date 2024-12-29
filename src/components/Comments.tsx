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
    <div className="prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl mx-auto w-full mb-4 hover:bg-slate-100 lg:hover:bg-transparent dark:hover:bg-slate-800 lg:dark:hover:bg-transparent px-1 rounded-md">
      <div className="flex justify-between items-center w-full max-w-[100vw]">
        <div className="flex items-center space-x-2 overflow-hidden">
          <a href={`/user/${comment.author}`} className="flex items-center space-x-1">
            <h3 className="font-semibold text-sm text-blue-400 whitespace-nowrap">{comment.author}</h3>
            {comment?.distinguished === "moderator" && (
              <p className="px-0.5 text-sm font-semibold text-green-500">{"MOD"}</p>
            )}
          </a>
          {comment.author === postAuthor && (
            <span className="whitespace-nowrap rounded-md bg-gray-100 dark:bg-slate-700 p-0.5 font-semibold text-xs text-blue-700">
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
      <BodyHtml body_html={comment.body_html} />
      <div className="text-gray-500 text-xs mt-2 dark:text-slate-200 flex space-x-1">
        <UpvoteIcon />
        <span>{comment.score.toLocaleString("en-US")}</span>
        <span>upvotes</span>
      </div>
      {comment.replies?.data?.children?.length > 0 && (
        <button className="dark:text-gray-300 text-xs mt-2" onClick={() => setShowReplies(!showReplies)}>
          {showReplies ? "➖ Hide Replies" : "➕ Show Replies"}
        </button>
      )}
      {showReplies && (
        <div className="relative border-l-[0.5px] border-gray-700 pl-1 lg:pl-3 ml-0">
          {comment.replies?.data?.children?.map((childWrapper: Children2) => {
            const child = childWrapper.data;
            return child ? (
              <div key={child.id} className="mt-4">
                <SingleComment comment={child} postAuthor={postAuthor} />
              </div>
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
