import React from "react";
import CommentIcon from "../static/CommentIcon";
import UpvoteIcon from "../static/UpvoteIcon";

export interface PostStatsProps {
  score: number;
  num_comments?: number;
}

const PostStats: React.FC<PostStatsProps> = ({score, num_comments}) => (
  <div className="text-gray-600 text-xs mt-2 dark:text-slate-200 flex items-center space-x-4 font-medium">
    <div className="flex items-center space-x-1 cursor-pointer">
      <UpvoteIcon />
      <span className="font-bold text-xs">{score.toLocaleString("en-US")}</span>
      <span className="text-xs">
        {score === 1 ? "upvote" : "upvotes"}
      </span>
    </div>
    {num_comments !== undefined && (
      <div className="flex items-center space-x-1 cursor-pointer">
        <CommentIcon />
        <span className="font-bold text-xs">{num_comments.toLocaleString("en-US")}</span>
        <span className="text-xs">
          {num_comments === 1 ? "comment" : "comments"}
        </span>
      </div>
    )}
  </div>
);

export default PostStats;
