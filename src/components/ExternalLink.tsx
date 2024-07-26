import ExternalLinkIcon from "../static/ExternalLinkIcon";

interface ExternalLinkProps {
  url_overridden_by_dest: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  url_overridden_by_dest,
}) => {
  return (
    <a
      href={url_overridden_by_dest}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 dark:text-blue-300 bg-slate-100 dark:bg-zinc-800 mt-2 px-1 py-2 rounded-md whitespace-nowrap text-xs font-medium overflow-auto flex items-center"
    >
      {url_overridden_by_dest}
      <ExternalLinkIcon />
    </a>
  );
};

export default ExternalLink;
