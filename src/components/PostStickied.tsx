import { FaThumbtack } from "react-icons/fa";
import type { Post } from "../types/post";
import { isRecentStickied } from "../utils/stickied";

const PostStickied = ({ post }: { post: Pick<Post, "stickied" | "created_utc"> }) => {
  if (!isRecentStickied(post)) return null;

  return (
    <span
      className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
      title="Marked pinned in the archive. Shown only for posts created in the past 24 hours."
    >
      <FaThumbtack aria-hidden="true" />
      Pinned
    </span>
  );
};

export default PostStickied;
