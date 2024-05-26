import he from "he";

type BodyHtmlProps = {
  body_html: string;
};

const BodyHtml: React.FC<BodyHtmlProps> = ({ body_html }) => {
  const decodedBodyHtml = he.decode(body_html.replace(/\n\n/g, "<br>"));
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: he.decode(decodedBodyHtml),
      }}
      className="mt-2 overflow-scroll text-gray-800 text-[15px] dark:text-zinc-200"
    />
  );
};

export default BodyHtml;
