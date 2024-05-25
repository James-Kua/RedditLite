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
      className="mt-2 overflow-scroll"
    />
  );
};

export default BodyHtml;
