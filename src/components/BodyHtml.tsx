import he from "he";
import { parseInlineImagesFromHtml } from "../utils/parser";

export type BodyHtmlProps = {
  body_html: string;
};

const BodyHtml: React.FC<BodyHtmlProps> = ({ body_html }) => {
  const decodedBodyHtml = he.decode(body_html.replace(/\n\n/g, "<br>"));
  const modifiedHtml = parseInlineImagesFromHtml(decodedBodyHtml);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: he.decode(modifiedHtml),
      }}
      className="rich-text-content mt-2 overflow-scroll text-gray-800 text-sm lg:text-md dark:text-zinc-200 leading-normal"
    />
  );
};

export default BodyHtml;
