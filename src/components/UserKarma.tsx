import AvatarIcon from "./AvatarIcon";

export interface UserKarmaProps {
  icon_img: string;
  total_karma?: number;
  comment_karma?: number;
}

const UserKarma: React.FC<UserKarmaProps> = ({ icon_img: icon_img, total_karma, comment_karma }) => {
  return (
    <div className="flex items-center gap-5 py-3 mb-6">
      {icon_img && (
        <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <AvatarIcon iconImg={icon_img} />
        </div>
      )}
      
      <div className="flex gap-8">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 leading-tight">
            {(total_karma ?? 0).toLocaleString("en-US")}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium tracking-wide uppercase mt-0.5">
            Post Karma
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-zinc-100 leading-tight">
            {(comment_karma ?? 0).toLocaleString("en-US")}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium tracking-wide uppercase mt-0.5">
            Comment Karma
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserKarma;
