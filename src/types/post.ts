export type Post = {
  id: string;
  author: string;
  author_flair_text?: string;
  author_flair_background_color?: string;
  created: number;
  title: string;
  selftext_html?: string;
  permalink: string;
  url_overridden_by_dest: string;
  thumbnail?: string;
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