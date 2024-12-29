import { Meta, StoryFn } from "@storybook/react";
import SecureMediaEmbed, { SecureMediaEmbedProps } from "../components/SecureMediaEmbed";

const meta: Meta = {
  title: "Components/SecureMediaEmbed",
  component: SecureMediaEmbed,
};

export default meta;

const Template: StoryFn<SecureMediaEmbedProps> = (args) => <SecureMediaEmbed {...args} />;

export const Default = Template.bind({});
Default.args = {
  url_overridden_by_dest: "https://twitter.com/MikeKeegan_DM/status/1850096380737462736",
  content:
    '&lt;blockquote class="twitter-video"&gt;&lt;p lang="en" dir="ltr"&gt;EXCLUSIVE&lt;br&gt;🔴Manchester United asked City if Kobbie Mainoo &amp;amp; Alejandro Garnacho could join their flight to Paris for Ballon d&amp;#39;Or&lt;br&gt;🔵City politely declined the request as the flight was full with their eight nominees&lt;br&gt;✒️&lt;a href="https://t.co/pCMuuyHGkO"&gt;https://t.co/pCMuuyHGkO&lt;/a&gt;&lt;/p&gt;&amp;mdash; Mike Keegan (@MikeKeegan_DM) &lt;a href="https://twitter.com/MikeKeegan_DM/status/1850096380737462736?ref_src=twsrc%5Etfw"&gt;October 26, 2024&lt;/a&gt;&lt;/blockquote&gt;\n&lt;script async src="https://platform.twitter.com/widgets.js" charset="utf-8"&gt;&lt;/script&gt;\n\n',
  media_domain_url: "https://www.redditmedia.com/mediaembed/1gch0a4",
  width: 350,
  height: 200,
};

export const YoutubeEmbed = Template.bind({});
YoutubeEmbed.args = {
  url_overridden_by_dest: "https://youtu.be/FgdNIPuO0h8?si=p5VK7XxZjaFhgC43&amp;t=84",
  content:
    '&lt;iframe width="356" height="200" src="https://www.youtube.com/embed/FgdNIPuO0h8?start=84&amp;feature=oembed&amp;enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="싱가포르 수출 전동열차 철도종합시험선로 왕복 시험운전"&gt;&lt;/iframe&gt;',
  media_domain_url: "https://www.redditmedia.com/mediaembed/1gctp8a",
  width: 356,
  height: 200,
  playing: true,
};

export const TwitterEmbed = Template.bind({});
TwitterEmbed.args = {
  url_overridden_by_dest: "https://twitter.com/MikeKeegan_DM/status/1850096380737462736",
  content:
    '&lt;blockquote class="twitter-video"&gt;&lt;p lang="en" dir="ltr"&gt;EXCLUSIVE&lt;br&gt;🔴Manchester United asked City if Kobbie Mainoo &amp;amp; Alejandro Garnacho could join their flight to Paris for Ballon d&amp;#39;Or&lt;br&gt;🔵City politely declined the request as the flight was full with their eight nominees&lt;br&gt;✒️&lt;a href="https://t.co/pCMuuyHGkO"&gt;https://t.co/pCMuuyHGkO&lt;/a&gt;&lt;/p&gt;&amp;mdash; Mike Keegan (@MikeKeegan_DM) &lt;a href="https://twitter.com/MikeKeegan_DM/status/1850096380737462736?ref_src=twsrc%5Etfw"&gt;October 26, 2024&lt;/a&gt;&lt;/blockquote&gt;\n&lt;script async src="https://platform.twitter.com/widgets.js" charset="utf-8"&gt;&lt;/script&gt;\n\n',
  media_domain_url: "https://www.redditmedia.com/mediaembed/1gch0a4",
  width: 350,
  height: 200,
};

export const TwitchEmbed = Template.bind({});
TwitchEmbed.args = {
  url_overridden_by_dest: "https://clips.twitch.tv/MagnificentSilkyTeaTinyFace-4GtxSj6DiPCAEBho",
  content:
    '&lt;iframe class="embedly-embed" src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fclips.twitch.tv%2Fembed%3Fclip%3DMagnificentSilkyTeaTinyFace-4GtxSj6DiPCAEBho%26parent%3Dcdn.embedly.com%26parent%3Dreddit.com%26parent%3Dwww.reddit.com%26parent%3Dold.reddit.com%26parent%3Dnew.reddit.com%26parent%3Dredditmedia.com%26muted%3Dtrue%26autoplay%3Dfalse&amp;display_name=Twitch.tv&amp;url=https%3A%2F%2Fclips.twitch.tv%2FMagnificentSilkyTeaTinyFace-4GtxSj6DiPCAEBho&amp;image=https%3A%2F%2Fclips-media-assets2.twitch.tv%2FOG6YqOBrcUo-g4jwgBAYaA%2FAT-cm%257COG6YqOBrcUo-g4jwgBAYaA-social-preview.jpg&amp;key=ed8fa8699ce04833838e66ce79ba05f1&amp;type=text%2Fhtml&amp;schema=twitch" width="600" height="340" scrolling="no" title="Twitch.tv embed" frameborder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture;" allowfullscreen="true"&gt;&lt;/iframe&gt;',
  media_domain_url: "https://www.redditmedia.com/mediaembed/1e6xb3x",
  width: 600,
  height: 340,
  playing: true,
};
