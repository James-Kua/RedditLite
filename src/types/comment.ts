export type Comment = {
  id: string;
  body_html: string;
  author: string;
  created: number;
  permalink: string;
  score: number;
  created_utc: number;
  parent_id: string;
  author_flair_text?: string;
};
