export interface Subreddit {
  title: string;
  display_name: string;
  display_name_prefixed: string;
  icon_img: string;
  accounts_active: number;
  subscribers: number;
  user_flair_richtext: UserFlairRichtext[];
  community_icon: string;
  public_description_html: string;
  description: string;
}

export interface UserFlairRichtext {
  a?: string;
  u?: string;
  e: string;
  t?: string;
}