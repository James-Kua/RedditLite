import he from "he";
import { useMemo } from "react";
import HoveredLinkPreview from "./HoveredLinkPreview";
import { parseInlineImagesFromHtml } from "../utils/parser";

export type BodyHtmlProps = {
  body_html: string;
};

const BodyHtml = ({ body_html }: BodyHtmlProps) => {
  const modifiedHtml = useMemo(() => {
    const decodedBodyHtml = he.decode(body_html.replace(/\n\n/g, "<br>"));
    return parseInlineImagesFromHtml(decodedBodyHtml);
  }, [body_html]);

  return (
    <HoveredLinkPreview className="rich-text-content mt-2 overflow-scroll text-gray-800 text-sm lg:text-md dark:text-zinc-200 leading-normal">
      <div
        dangerouslySetInnerHTML={{
          __html: he.decode(modifiedHtml),
        }}
      />
    </HoveredLinkPreview>
  );
};

export default BodyHtml;
