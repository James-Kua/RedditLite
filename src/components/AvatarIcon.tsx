import he from "he";

interface AvatarIconProps {
  iconImg: string;
  alt?: string;
}

const AvatarIcon: React.FC<AvatarIconProps> = ({ iconImg }) => {
  return <img src={he.decode(iconImg)} className="h-12 w-12 rounded-lg" />;
};

export default AvatarIcon;
