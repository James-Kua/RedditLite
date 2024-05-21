export type Post = {
  id: string;
  author: string;
  author_flair_text?: string;
  created: number;
  title: string;
  selftext_html?: string;
  permalink: string;
  url_overridden_by_dest: string;
  thumbnail?: string;
  media_metadata?: any[];
  link_flair_text: string;
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