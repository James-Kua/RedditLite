import he from "he";

type SelfTextHtmlProps = {
  selftext_html: string;
  truncateLines?: number;
};

const SelfTextHtml: React.FC<SelfTextHtmlProps> = ({
  selftext_html,
  truncateLines,
}) => {
  const truncatedHtml = truncateLines
    ? truncateHtmlBody(selftext_html, truncateLines)
    : selftext_html;

  return (
    <div
      className="rich-text-content mt-1 text-sm lg:text-[15px] text-gray-700 overflow-scroll dark:text-zinc-300 leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: he.decode(truncatedHtml.replace(/\n\n/g, "<br>")),
      }}
    />
  );
};

const truncateHtmlBody = (text: string, lines: number): string => {
  const truncated = text.split("\n").slice(0, lines).join("\n");
  return truncated;
};

export default SelfTextHtml;
