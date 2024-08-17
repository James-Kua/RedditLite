export type User = {
  subreddit: string;
  id: string;
  num_comments: number;
  body?: string;
  body_html?: string;
  selftext?: string;
  score: number;
  permalink: string;
  link_permalink?: string;
  link_title?: string;
  name: string;
  subreddit_name_prefixed: string;
  author_flair_text?: string;
  created: number;
  created_utc: number;
  edited?: boolean | number;
  link_url?: string;
  title?: string;
  link_flair_text?: string;
  thumbnail?: string;
  selftext_html?: string;
  url?: string;
  url_overridden_by_dest?: string;
  poll_data?: PollData;
};

export type UserProfile = {
  awardee_karma: number;
  awarder_karma: number;
  icon_img: string;
  link_karma: number;
  total_karma: number;
  name: string;
  snoovatar_img: string;
  comment_karma: number;
};

export type PollData = {
  options: {
    text: string;
    vote_count: number;
    id: string;
  }[];
  total_vote_count: number;
  user_selection?: string;
  voting_end_timestamp: string;
};
