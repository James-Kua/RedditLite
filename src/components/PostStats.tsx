import React from "react";
import CommentIcon from "../static/CommentIcon";
import UpvoteIcon from "../static/UpvoteIcon";

interface PostStatsProps {
  score: number;
  num_comments: number;
}

const PostStats: React.FC<PostStatsProps> = ({ score, num_comments }) => {
  return (
    <div className="text-gray-500 text-xs mt-2 dark:text-slate-100 flex items-center space-x-2 font-medium">
      <div className="flex items-center space-x-1">
        <UpvoteIcon />
        <span>{score.toLocaleString("en-US")}</span>
        <span>upvotes</span>
      </div>
      <div className="flex items-center space-x-1">
        <CommentIcon />
        <span>{num_comments.toLocaleString("en-US")}</span>
        <span>comments</span>
      </div>
    </div>
  );
};

export default PostStats;
