type PostLockProps = {
  locked: boolean;
};

const PostLocked: React.FC<PostLockProps> = ({ locked }) => {
  if (!locked) return null;

  return (
    <div className="text-gray-800 text-[15px] dark:text-zinc-200 border border-gray-500 p-2 rounded my-4">
      🔒 Locked post. New comments cannot be posted.
    </div>
  );
};

export default PostLocked;
