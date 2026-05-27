import React from "react";
import CommentIcon from "../static/CommentIcon";
import UpvoteIcon from "../static/UpvoteIcon";

export interface PostStatsProps {
  score: number;
  num_comments?: number;
}

const PostStats: React.FC<PostStatsProps> = ({score, num_comments}) => (
  <div className="text-[#8C9EB5] text-xs mt-2 dark:text-slate-400 flex items-center space-x-6 font-bold">
    <div className="flex items-center space-x-1.5 cursor-pointer hover:text-gray-500 transition-colors">
      <UpvoteIcon />
      <span>{score.toLocaleString("en-US")}</span>
    </div>
    {num_comments !== undefined && (
      <div className="flex items-center space-x-1.5 cursor-pointer hover:text-gray-500 transition-colors">
        <CommentIcon />
        <span>{num_comments.toLocaleString("en-US")}</span>
      </div>
    )}
  </div>
);

export default PostStats;
