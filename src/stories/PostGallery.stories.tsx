import { Meta, StoryFn } from "@storybook/react";
import PostGallery from "../components/PostGallery";
import '../../src/index.css';

const galleryData ={
  "items": [
    {
      "caption": "",
      "media_id": "8a01ai0fhxwd1",
      "id": 540493886
    },
    {
      "caption": "",
      "media_id": "gchdg7gfhxwd1",
      "id": 540493887
    },
    {
      "caption": "",
      "media_id": "dq2sr1pfhxwd1",
      "id": 540493888
    },
    {
      "caption": "",
      "media_id": "eh2zqizfhxwd1",
      "id": 540493889
    },
    {
      "caption": "",
      "media_id": "1s1tb67ghxwd1",
      "id": 540493890
    },
    {
      "caption": "",
      "media_id": "vqejrdnghxwd1",
      "id": 540493891
    },
    {
      "caption": "",
      "media_id": "0l5bzh2hhxwd1",
      "id": 540493892
    }
  ]
}

const mediaMetadata = {
  abc123: { m: "jpg" },
  def456: { m: "png" },
  ghi789: { m: "gif" },
};

const meta: Meta = {
  title: "Components/PostGallery",
  component: PostGallery,
};

export default meta;

const Template: StoryFn<{ galleryData: any; mediaMetadata: any }> = (args) => <PostGallery {...args} />;

export const Default = Template.bind({});
Default.args = {
  galleryData,
  mediaMetadata,
};