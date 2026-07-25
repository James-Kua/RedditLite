export const timeOptions = [
  { key: "All Time", value: "all" },
  { key: "Past Hour", value: "hour" },
  { key: "Past Day", value: "day" },
  { key: "Past Week", value: "week" },
  { key: "Past Month", value: "month" },
  { key: "Past Year", value: "year" },
];

// Arctic Shift only pages chronologically, so ranking by score means scanning
// the whole window client-side. Offer the ranges that stay a few requests wide.
const TOP_SORT_TIMES = ["week", "month"];
const DEFAULT_TOP_SORT_TIME = "week";

export const timeOptionsForSort = (sort: string) =>
  sort === "top" ? timeOptions.filter(({ value }) => TOP_SORT_TIMES.includes(value)) : timeOptions;

export const resolveTimeForSort = (sort: string, time: string) =>
  sort === "top" && !TOP_SORT_TIMES.includes(time) ? DEFAULT_TOP_SORT_TIME : time;

export const postTypeOptions = [
  { key: "All", value: "all" },
  { key: "Image", value: "image" },
  { key: "Video", value: "video" },
  { key: "Text", value: "text" },
  { key: "Link", value: "link" },
  { key: "Gallery", value: "gallery" },
];
