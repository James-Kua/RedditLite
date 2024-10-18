import AvatarIcon from "./AvatarIcon";

interface UserKarmaProps {
  iconImg: string;
  total_karma?: number;
  comment_karma?: number;
}

const UserKarma: React.FC<UserKarmaProps> = ({ iconImg, total_karma, comment_karma }) => {
  return (
    <div>
      {iconImg && <AvatarIcon iconImg={iconImg} />}
      <div className="flex items-center text-gray-500 text-sm font-medium mt-2 dark:text-white">
        <span>🏆 {(total_karma ?? 0).toLocaleString("en-US")} post karma</span>
      </div>
      <div className="flex items-center text-gray-500 text-sm font-medium mt-1 dark:text-white">
        <span>💬 {(comment_karma ?? 0).toLocaleString("en-US")} comment karma</span>
      </div>
    </div>
  );
};

export default UserKarma;
