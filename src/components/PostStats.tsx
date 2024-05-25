import React from "react";

interface PostStatsProps {
  score: number;
  num_comments: number;
}

const PostStats: React.FC<PostStatsProps> = ({ score, num_comments }) => {
  return (
    <div className="text-gray-500 text-sm mt-2">
      🔼 {score.toLocaleString("en-US")} upvotes 💬{" "}
      {num_comments.toLocaleString("en-US")} comments
    </div>
  );
};

export default PostStats;
