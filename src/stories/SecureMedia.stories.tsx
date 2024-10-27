import { Meta, StoryFn } from "@storybook/react";
import SecureMedia from "../components/SecureMedia";

const meta: Meta = {
  title: "Components/SecureMedia",
  component: SecureMedia,
};

export default meta;

const Template: StoryFn<{
  reddit_video: {
    hls_url: string;
    fallback_url: string;
    width: number;
    height: number;
  };
  playing?: boolean;
}> = (args) => <SecureMedia {...args} />;

export const Default = Template.bind({});
Default.args = {
  reddit_video: {
    fallback_url: "https://v.redd.it/8xgjmykq33xd1/DASH_720.mp4?source=fallback",
    height: 720,
    width: 1280,
    hls_url:
      "https://v.redd.it/8xgjmykq33xd1/HLSPlaylist.m3u8?a=1732586234%2CNGFmMzBkNTJmZjIwYWRkMzc2MjQxYWRhODliMDc2YjllN2ZkYmFmZjg1MGU3ZDJlM2Q3YjE0NDIzNTg3ZDkwNg%3D%3D&amp;v=1&amp;f=sd",
  },
};
