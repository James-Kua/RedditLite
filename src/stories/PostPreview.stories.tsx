import { Meta, StoryFn } from "@storybook/react";
import PostPreview, { PostPreviewProps } from "../components/PostPreview";

const meta: Meta = {
  title: "Components/PostPreview",
  component: PostPreview,
};

export default meta;

const Template: StoryFn<PostPreviewProps> = (args) => <PostPreview {...args} />;

export const Default = Template.bind({});
Default.args = {
  preview: {
    images: [
      {
        source: {
          url: "https://external-preview.redd.it/dcJ2qHN5C-tpXzGaLFsIDaIiF1tWYFssStK64jodafQ.jpg?auto=webp&amp;s=5ad50e7668816fc26875e58a55733119c71b3a3e",
          width: 2000,
          height: 1123,
        },
        resolutions: [
          {
            url: "https://external-preview.redd.it/dcJ2qHN5C-tpXzGaLFsIDaIiF1tWYFssStK64jodafQ.jpg?width=960&amp;crop=smart&amp;auto=webp&amp;s=0d1d31168474817d1b446cefac240a2a2c44bfa0",
            width: 960,
            height: 539,
          },
          {
            url: "https://external-preview.redd.it/dcJ2qHN5C-tpXzGaLFsIDaIiF1tWYFssStK64jodafQ.jpg?width=1080&amp;crop=smart&amp;auto=webp&amp;s=94949782c15ef7fd63525facca9a00b1c41a730f",
            width: 1080,
            height: 606,
          },
        ],
        variants: {},
        id: "xrV8YiZD7CN5yq2rgPk6kubNzSREUT9jWCshVsJBn04",
      },
    ],
  },
};

export const Gif = Template.bind({});
Gif.args = {
  preview: {
    images: [
      {
        source: {
          url: "https://external-preview.redd.it/b6Edsl2aZ_xAMno1_RxQkbz5R60WP1RtPIttBNJG7Pg.gif?format=png8&amp;s=708af931b542a1ac6c8af03efed53ffea3f1ef13",
          width: 480,
          height: 400,
        },
        resolutions: [
          {
            url: "https://external-preview.redd.it/b6Edsl2aZ_xAMno1_RxQkbz5R60WP1RtPIttBNJG7Pg.gif?width=216&amp;crop=smart&amp;format=png8&amp;s=d93e7b42ca4bb42ff7f1264b7a34076913668f82",
            width: 216,
            height: 180,
          },
          {
            url: "https://external-preview.redd.it/b6Edsl2aZ_xAMno1_RxQkbz5R60WP1RtPIttBNJG7Pg.gif?width=320&amp;crop=smart&amp;format=png8&amp;s=bc2a6ecdd53e5ceee39910436bac77940df97639",
            width: 320,
            height: 266,
          },
        ],
        variants: {
          gif: {
            source: {
              url: "https://external-preview.redd.it/b6Edsl2aZ_xAMno1_RxQkbz5R60WP1RtPIttBNJG7Pg.gif?s=619b804c5df9a1d1d43df76f04bfcc2016d46c99",
              width: 480,
              height: 400,
            },
            resolutions: [
              {
                url: "https://external-preview.redd.it/b6Edsl2aZ_xAMno1_RxQkbz5R60WP1RtPIttBNJG7Pg.gif?width=320&amp;crop=smart&amp;s=68a97925c4a2a464482df149be80041a8f6b1a71",
                width: 320,
                height: 266,
              },
            ],
          },
          mp4: {
            source: {
              url: "https://external-preview.redd.it/b6Edsl2aZ_xAMno1_RxQkbz5R60WP1RtPIttBNJG7Pg.gif?format=mp4&amp;s=db5fd24c67456890bc0829819f47698ba92234c4",
              width: 480,
              height: 400,
            },
            resolutions: [
              {
                url: "https://external-preview.redd.it/b6Edsl2aZ_xAMno1_RxQkbz5R60WP1RtPIttBNJG7Pg.gif?width=320&amp;format=mp4&amp;s=77d9f5daaa9dd26531354601bfb433bde77078c2",
                width: 320,
                height: 266,
              },
            ],
          },
        },
        id: "L9-tYjOSaMuZKmWrumWbHEOAyPhmWLXms_hR-_32dgg",
      },
    ],
  },
};
