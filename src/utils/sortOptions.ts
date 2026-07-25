// No "Top" here: ranking by score means scanning the whole window, and Arctic
// Shift puts keyword searches on a 5 requests/minute rate limit.
export const searchSortOptions = [
  { key: "Newest", value: "newest" },
  { key: "Oldest", value: "oldest" },
];

export const subredditSortOptions = [
  { key: "Newest", value: "newest" },
  { key: "Oldest", value: "oldest" },
  { key: "Top", value: "top" },
];

export const commentSortOptions = [
  { key: "Newest", value: "newest" },
  { key: "Oldest", value: "oldest" },
];
