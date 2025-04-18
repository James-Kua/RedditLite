import he from "he";
import { parseInlineImagesFromHtml } from "../utils/parser";

type SelfTextHtmlProps = {
  selftext_html: string;
  truncateLines?: number;
};

const SelfTextHtml: React.FC<SelfTextHtmlProps> = ({ selftext_html, truncateLines }) => {

  const truncatedHtml = truncateLines ? truncateHtmlBody(selftext_html, truncateLines) : selftext_html;
  const decodedHtml = he.decode(truncatedHtml.replace(/\n\n/g, "<br>"));
  const modifiedHtml = parseInlineImagesFromHtml(decodedHtml);

  return (
    <div
      className="rich-text-content mt-1 text-sm text-gray-700 lg:text-md overflow-scroll dark:text-zinc-300 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: modifiedHtml }}
    />
  );
};

const truncateHtmlBody = (text: string, lines: number): string => {
  const truncated = text.split("\n").slice(0, lines).join("\n");
  return truncated;
};

export default SelfTextHtml;
