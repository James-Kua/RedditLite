export type Post = {
  id: string;
  author: string;
  author_flair_text?: string;
  author_flair_background_color?: string;
  author_flair_richtext: AuthorFlairRichtext[]
  created: number;
  title: string;
  selftext_html?: string;
  permalink: string;
  url_overridden_by_dest: string;
  thumbnail?: string;
  media: Media
  secure_media_embed: SecureMediaEmbed
  media_metadata?: any[];
  link_flair_text: string;
  link_flair_text_color: string;
  link_flair_background_color: string;
  score: number;
  num_comments: number;
  gallery_data?: GalleryData
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