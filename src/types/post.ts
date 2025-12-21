export type Post = {
  id: string;
  author: string;
  author_flair_text?: string;
  author_flair_background_color?: string;
  author_flair_richtext: AuthorFlairRichtext[]
  body_html?: string;
  created: number;
  created_utc: number;
  edited: boolean | number;
  title: string;
  selftext_html?: string;
  permalink: string;
  preview: Preview
  url: string;
  url_overridden_by_dest: string;
  post_hint: string;
  thumbnail?: string;
  media: Media
  secure_media?: SecureMedia
  secure_media_embed: SecureMediaEmbed
  media_metadata?: any[];
  link_flair_text: string;
  link_flair_richtext: LinkFlairRichtext[];
  link_flair_text_color: string;
  link_flair_background_color: string;
  link_url?: string;
  link_permalink?: string;
  link_title?: string;
  over_18: boolean;
  score: number;
  upvote_ratio: number;
  subreddit: string;
  subreddit_name_prefixed: string;
  num_comments: number;
  gallery_data?: GalleryData
  locked: boolean
  crosspost_parent_list?: Post[]
  poll_data?: PollData
  sr_detail?: SrDetail;
};

interface GalleryData {
  items: GalleryItem[]
}

interface GalleryItem {
  caption: string
  outbound_url: string
  media_id: string
  id: number
}

export interface Media {
  type: string
}

export interface SecureMediaEmbed {
  content: string
  width: number
  scrolling: boolean
  media_domain_url: string
  height: number
}

export interface AuthorFlairRichtext {
  e: string
  t?: string
  a?: string
  u?: string
}

export interface LinkFlairRichtext {
  e: string
  t?: string
  a?: string
  u?: string
}

export interface SecureMedia {
  reddit_video: RedditVideo
}

export interface RedditVideo {
  hls_url: string
  fallback_url: string
  height: number
  width: number
}

export interface Preview {
  images: Image[];
  reddit_video_preview?: RedditVideo;
}

export interface Image {
  source: Source;
  resolutions: Resolution[];
  variants?: {
    gif?: Variant;
    mp4?: Variant;
  };
  id: string;
}

export interface Source {
  url: string;
  width: number;
  height: number;
}

export interface Resolution {
  url: string;
  width: number;
  height: number;
}

export interface Variant {
  source: Source;
  resolutions: Resolution[];
}

export interface PollData {
  options: {
    text: string;
    vote_count: number;
    id: string;
  }[];
  total_vote_count: number;
  user_selection?: string;
  voting_end_timestamp: string;
}

export type SrDetail = {
  default_set: boolean;
  banner_img: string;
  allowed_media_in_comments: string[];
  user_is_banned: boolean | null;
  free_form_reports: boolean;
  community_icon: string;
  show_media: boolean;
  description: string;
  user_is_muted: boolean | null;
  display_name: string;
  header_img: string;
  title: string;
  previous_names: string[];
  user_is_moderator: boolean | null;
  over_18: boolean;
  icon_size: number[];
  primary_color: string;
  icon_img: string;
  icon_color: string;
  submit_link_label: string;
  header_size: number[];
  restrict_posting: boolean;
  restrict_commenting: boolean;
  subscribers: number;
  submit_text_label: string;
  link_flair_position: string;
  display_name_prefixed: string;
  key_color: string;
  name: string;
  created: number;
  url: string;
  quarantine: boolean;
  created_utc: number;
  banner_size: number[] | null;
  user_is_contributor: boolean | null;
  accept_followers: boolean;
  public_description: string;
  link_flair_enabled: boolean;
  disable_contributor_requests: boolean;
  subreddit_type: string;
  user_is_subscriber: boolean | null;
};