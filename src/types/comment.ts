export type Comment = {
  id: string;
  body_html: string;
  author: string;
  created: number;
  edited: boolean | number;
  permalink: string;
  score: number;
  created_utc: number;
  parent_id: string;
  author_flair_text?: string;
  author_flair_background_color?: string;
  author_flair_richtext: AuthorFlairRichtext[]
  author_flair_text_color?: string;
  replies: Replies;
};

export interface Children {
  kind: string
  data: Comment;
}

export interface Data2 {
  children: Children2[]
}

export interface Children2 {
  kind: string
  data: Comment;
}

export type Replies = {
  kind: string;
  data: Data2;
}

export interface AuthorFlairRichtext {
  e: string
  t?: string
  a?: string
  u?: string
}