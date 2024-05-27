import React from "react";

interface PostStatsProps {
  score: number;
  num_comments: number;
}

const PostStats: React.FC<PostStatsProps> = ({ score, num_comments }) => {
  return (
    <div className="text-gray-500 text-xs mt-2 dark:text-slate-200">
      🔼 {score.toLocaleString("en-US")} upvotes 💬{" "}
      {num_comments.toLocaleString("en-US")} comments
    </div>
  );
};

export default PostStats;
