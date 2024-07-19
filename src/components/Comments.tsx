import { useEffect, useState } from "react";
import { Comment, Children2 } from "../types/comment";
import AuthorFlairText from "./AuthorFlairText";
import BodyHtml from "./BodyHtml";
import CreatedEditedLabel from "./CreatedEditedLabel";

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

const CommentComponent = ({
  comment,
  postAuthor,
}: {
  comment: Comment;
  postAuthor: string;
}) => {
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
          <a href={`/user/${comment.author}`}>
            <h3 className="font-semibold text-sm text-blue-400">
              {comment.author}
            </h3>
          </a>
          {comment.author === postAuthor && (
            <span className="whitespace-nowrap rounded-lg bg-blue-100 p-1 font-semibold text-xs text-blue-700 overflow-x-auto">
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
        <CreatedEditedLabel created={comment.created} edited={comment.edited} />
      </div>
      <BodyHtml body_html={comment.body_html} />
      <div className="text-gray-500 text-xs mt-2 dark:text-slate-200">
        🔼 {comment.score || 0} upvotes
      </div>
      {comment.replies?.data?.children?.length > 0 && (
        <button
          className="dark:text-gray-300 text-xs mt-2"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? "➖ Hide Replies" : "➕ Show Replies"}
        </button>
      )}
      {showReplies && (
        <div className="relative border-l-[0.5px] border-gray-700 pl-2 lg:pl-4 ml-1">
          {comment.replies?.data?.children?.map((childWrapper: Children2) => {
            const child = childWrapper.data;
            return child ? (
              <div key={child.id} className="mt-4">
                <CommentComponent comment={child} postAuthor={postAuthor} />
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

const CommentsComponent = ({
  comments,
  postAuthor,
  searchTerm,
}: {
  comments: Comment[];
  postAuthor: string;
  searchTerm: string;
}) => {
  const filteredComments = filterComments(comments, searchTerm);

  return (
    <>
      {filteredComments.map((comment) => (
        <CommentComponent
          key={comment.id}
          comment={comment}
          postAuthor={postAuthor}
        />
      ))}
    </>
  );
};

export default CommentsComponent;
