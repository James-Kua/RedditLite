import React from "react";

const UpvoteIcon: React.FC = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-none w-3.5 h-3.5 cursor-pointer"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

export default UpvoteIcon;
