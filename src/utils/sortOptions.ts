export const searchSortOptions = [
  { key: "Relevance", value: "relevance" },
  { key: "Hot", value: "hot" },
  { key: "New", value: "new" },
  { key: "Top", value: "top" },
  { key: "Rising", value: "rising" },
];

export const subredditSortOptions = searchSortOptions.filter(
  (option) => option.value !== "relevance"
);
