import React from "react";

interface UpvotePercentageLabelProps {
  upvote_ratio: number;
}

const UpvotePercentageLabel: React.FC<UpvotePercentageLabelProps> = ({ upvote_ratio }) => {
  const truncatedPercentage = Math.trunc(upvote_ratio * 100);

  return (
    <span className="flex space-x-1 whitespace-nowrap w-fit text-xs dark:text-blue-300 mt-1">
      <h3 className="whitespace-nowrap font-medium">{truncatedPercentage}% upvoted</h3>
    </span>
  );
};

export default UpvotePercentageLabel;
