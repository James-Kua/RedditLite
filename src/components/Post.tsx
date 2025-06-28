import he from "he";
import type { Post } from "../types/post";
import { isImage, parsePermalink } from "../utils/parser";
import AuthorFlairText from "./AuthorFlairText";
import LinkFlairText from "./LinkFlairText";
import { FetchImage } from "../utils/image";
import Thumbnail from "./Thumbnail";
import SecureMediaEmbed from "./SecureMediaEmbed";
import SecureMedia from "./SecureMedia";
import SelfTextHtml from "./SelfTextHtml";
import PostGallery from "./PostGallery";
import PostStats from "./PostStats";
import PostPreview from "./PostPreview";
import CreatedEditedLabel from "./CreatedEditedLabel";
import PostLock from "./PostLock";
import PollData from "./PollData";
import ExternalLink from "./ExternalLink";
import UpvotePercentageLabel from "./UpvotePercentageLabel";

const PostComponent = ({ post }: { post: Post }) => {
  document.title = post.title;

  return (
    <div
      key={post.id}
      className="bg-slate-200 dark:bg-neutral-800 shadow-md rounded-xl p-4 mb-4 w-full mx-auto prose prose-sm text-gray-700 dark:text-gray-300 prose-headings:font-semibold prose-headings:text-xl overflow-auto"
    >
      <div className="flex items-center space-x-2 mb-1">
        <a href={`/user/${post.author}`}>
          <h3 className="text-blue-500 font-semibold whitespace-nowrap hover:underline">{post.author}</h3>
        </a>
        <AuthorFlairText
          author_flair_richtext={post.author_flair_richtext}
          author_flair_text={post.author_flair_text}
          author_flair_background_color={post.author_flair_background_color}
        />
      </div>
      <a
        href={`${
          post.crosspost_parent_list?.[0].permalink ??
          post.url_overridden_by_dest ??
          post.url
        }`}
      >
        <CreatedEditedLabel created={post.created} edited={post.edited} />

        <div className="mt-1">
          <UpvotePercentageLabel upvote_ratio={post.upvote_ratio} />
        </div>

        <h2 className="text-lg font-bold dark:text-white my-2 group-hover:underline">{he.decode(post.title)}</h2>

        <LinkFlairText
          link_flair_richtext={post.link_flair_richtext}
          link_flair_text={post.link_flair_text}
          link_flair_background_color={post.link_flair_background_color}
        />

        {post.crosspost_parent_list ? (
          <div className="px-4 pt-4 rounded-md border-2 border-gray-300 dark:border-gray-600 mt-3 bg-white dark:bg-neutral-900">
            <div className="font-bold dark:text-white mb-2">
              {post.crosspost_parent_list[0].subreddit_name_prefixed}
            </div>
            <p className="text-gray-600 dark:text-slate-300">
              <a href={parsePermalink(post.crosspost_parent_list[0].permalink)} className="text-blue-400">
                <PostComponent post={post.crosspost_parent_list[0]} />
              </a>
            </p>
          </div>
        ) : post.secure_media_embed?.media_domain_url ? (
          <SecureMediaEmbed
            url_overridden_by_dest={post.url_overridden_by_dest}
            playing={true}
            {...post.secure_media_embed}
          />
        ) : post.secure_media ? (
          <SecureMedia playing={true} {...post.secure_media} />
        ) : post.media_metadata ? (
          <div className="relative mt-2">
            {post.gallery_data ? (
              <PostGallery galleryData={post.gallery_data} mediaMetadata={post.media_metadata} />
            ) : null}
          </div>
        ) : post.preview ? (
          <PostPreview preview={post.preview} />
        ) : post.url_overridden_by_dest ? (
          isImage(post.url_overridden_by_dest) ? (
            <img
              src={post.url_overridden_by_dest}
              alt="url_overridden_by_dest"
              className="mt-4 max-w-full max-h-[500px] mx-auto border rounded-md p-2 object-contain"
            />
          ) : (
            <FetchImage url={post.url_overridden_by_dest} />
          )
        ) : (
          <Thumbnail thumbnail={post.thumbnail || ""} />
        )}
        {post.poll_data && (
          <PollData poll_data={post.poll_data} />
        )}
        {post.selftext_html && (
          <SelfTextHtml selftext_html={post.selftext_html} />
        )}
        {!post.crosspost_parent_list && post.url_overridden_by_dest && !isImage(post.url_overridden_by_dest) && !post.gallery_data && (
            <ExternalLink url_overridden_by_dest={post.url_overridden_by_dest} />
        )}
      </a>
      <PostLock locked={post.locked} />
      <PostStats score={post.score} num_comments={post.num_comments} />
    </div>
  );
};

export default PostComponent;
