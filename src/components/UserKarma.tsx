import AvatarIcon from "./AvatarIcon";

export interface UserKarmaProps {
  icon_img: string;
  total_karma?: number;
  comment_karma?: number;
}

const UserKarma: React.FC<UserKarmaProps> = ({ icon_img: icon_img, total_karma, comment_karma }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-4 flex items-center gap-4">
      {icon_img && (
        <div className="shrink-0 rounded-full border-2 border-gray-300 dark:border-zinc-700 p-1">
          <AvatarIcon iconImg={icon_img} />
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-gray-700 dark:text-white text-sm font-semibold">
          <span className="text-yellow-500">🏆</span>
          <span>{(total_karma ?? 0).toLocaleString("en-US")} post karma</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-white text-sm font-semibold mt-1">
          <span className="text-blue-500">💬</span>
          <span>{(comment_karma ?? 0).toLocaleString("en-US")} comment karma</span>
        </div>
      </div>
    </div>
  );
};

export default UserKarma;
