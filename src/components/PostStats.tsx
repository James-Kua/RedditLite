import React from "react";
import CommentIcon from "../static/CommentIcon";
import UpvoteIcon from "../static/UpvoteIcon";

export interface PostStatsProps {
  score: number;
  num_comments?: number;
}

const PostStats: React.FC<PostStatsProps> = ({ score, num_comments }) => {
  return (
    <div className="text-gray-500 text-xs mt-2 dark:text-slate-100 flex items-center space-x-4 font-medium">
      <div className="flex items-center space-x-1">
        <UpvoteIcon />
        <span>{score.toLocaleString("en-US")}</span>
        <span>Upvotes</span>
      </div>
      {typeof num_comments !== 'undefined' && (
        <div className="flex items-center space-x-1">
          <CommentIcon />
          <span>{num_comments.toLocaleString("en-US")}</span>
          <span>Comments</span>
        </div>
      )}
    </div>
  );
};

export default PostStats;
