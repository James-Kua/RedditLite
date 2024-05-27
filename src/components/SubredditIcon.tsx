import he from "he";
import React from "react";

type SubredditIconProps = {
  community_icon?: string;
  icon_img?: string;
};

const SubredditIcon: React.FC<SubredditIconProps> = ({
  community_icon,
  icon_img,
}) => {
  const src = community_icon || icon_img;
  const alt = community_icon ? "community_icon" : "icon_img";

  return src ? (
    <img
      src={he.decode(src)}
      alt={alt}
      className="w-8 h-8 rounded-lg mr-2"
    />
  ) : null;
};

export default SubredditIcon;
