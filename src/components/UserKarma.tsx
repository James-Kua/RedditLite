interface UserKarmaProps {
  iconImg: string;
  username: string;
  total_karma?: number;
  comment_karma?: number;
}

const UserKarma: React.FC<UserKarmaProps> = ({
  iconImg,
  username,
  total_karma,
  comment_karma,
}) => {
  return (
    <div>
      {iconImg && (
        <img
          src={iconImg.replace(/&amp;/g, "&")}
          alt={username}
          className="h-12 w-12 rounded-lg"
        />
      )}
      <div className="flex items-center text-gray-500 text-sm font-medium mt-2 dark:text-white">
        <span>🏆 {(total_karma ?? 0).toLocaleString("en-US")} post karma</span>
      </div>
      <div className="flex items-center text-gray-500 text-sm font-medium mt-1 dark:text-white">
        <span>
          💬 {(comment_karma ?? 0).toLocaleString("en-US")} comment karma
        </span>
      </div>
    </div>
  );
};

export default UserKarma;
