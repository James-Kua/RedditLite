import { Meta, StoryFn } from "@storybook/react";
import SubredditCard from "../components/SubredditCard";

const meta: Meta = {
  title: "Components/SubredditCard",
  component: SubredditCard,
};

export default meta;

const Template: StoryFn<{
  subreddit: {
    display_name_prefixed: string;
    banner_background_image?: string;
    banner_img?: string;
    community_icon?: string;
    icon_img?: string;
    subscribers?: number;
    public_description_html?: string;
  };
}> = (args) => <SubredditCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  subreddit: {
    display_name_prefixed: "r/JapanTravel",
    banner_background_image: "https://styles.redditmedia.com/t5_2uylr/styles/bannerBackgroundImage_2z3c8vu0ihv01.png?width=4000&amp;s=6873686105ad626cfdf521eb13fac0496fb4c9f1",
    banner_img: "https://b.thumbs.redditmedia.com/ffAVls-eNUF0ojMocZCP20ubhbK-zwqJEjHSlFw6k2s.png",
    community_icon: "",
    icon_img: "https://b.thumbs.redditmedia.com/KpNn8_Uu1kR6wlp8yGujNG5duDfxVX7MRJCK1V0T7hc.png",
    subscribers: 200000,
    public_description_html: "&lt;!-- SC_OFF --&gt;&lt;div class=\"md\"&gt;&lt;p&gt;Got questions? Need advice? Overwhelmed with your itinerary? Want to share your travel tips and experiences in Japan? Then this is the place for you! &lt;a href=\"/r/JapanTravel\"&gt;/r/JapanTravel&lt;/a&gt; is for any and all looking to visit Japan as a tourist — including those who have already been.&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;",
  },
};