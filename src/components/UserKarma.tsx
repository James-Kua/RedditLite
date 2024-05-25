interface UserKarmaProps {
  iconImg: string;
  username: string;
  totalKarma: number;
  commentKarma: number;
}

const UserKarma: React.FC<UserKarmaProps> = ({
  iconImg,
  username,
  totalKarma,
  commentKarma,
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
      <div className="flex items-center bg-white text-gray-500 text-sm font-medium mt-2">
        {totalKarma && (
          <span>🏆 {totalKarma.toLocaleString("en-US")} post karma</span>
        )}
      </div>
      <div className="flex items-center bg-white text-gray-500 text-sm font-medium mt-1">
        {commentKarma && (
          <span>💬 {commentKarma.toLocaleString("en-US")} comment karma</span>
        )}
      </div>
    </div>
  );
};

export default UserKarma;
