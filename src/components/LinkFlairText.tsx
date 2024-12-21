import { LinkFlairRichtext } from "../types/post";
import { parseLinkFlairTextColor } from "../utils/parser";

interface LinkFlairTextProps {
  link_flair_richtext?: LinkFlairRichtext[];
  link_flair_text?: string;
  link_flair_background_color?: string;
}

const LinkFlairText = ({
    link_flair_richtext = [],
    link_flair_text,
    link_flair_background_color,
  }: LinkFlairTextProps) => {
    return (
      (link_flair_richtext.length > 0 || link_flair_text) && (
        <div
          className="rounded-lg p-0.5 text-xs overflow-x-auto w-fit font-medium whitespace-nowrap"
          style={{
            backgroundColor: link_flair_background_color || "#bbbb",
          }}
        >
          {link_flair_richtext.length > 0 ? (
            link_flair_richtext.map(
              (flair: LinkFlairRichtext, index: number) => (
                <span key={index}>
                  {flair.e === "emoji" ? (
                    <img
                      src={flair.u}
                      alt={flair.a}
                      width={16}
                      height={16}
                      className="inline-block"
                    />
                  ) : (
                    <span
                      className="rounded-lg p-0.5 text-xs overflow-x-auto w-fit font-medium whitespace-nowrap"
                      style={{
                        backgroundColor: link_flair_background_color || "",
                        color: parseLinkFlairTextColor(
                          link_flair_background_color || ""
                        ),
                      }}
                    >
                      {flair.t}
                    </span>
                  )}
                </span>
              )
            )
          ) : (
            <span
              className="rounded-lg p-0.5 text-xs overflow-x-auto w-fit font-medium whitespace-nowrap"
              style={{
                backgroundColor: link_flair_background_color || "",
                color: parseLinkFlairTextColor(
                  link_flair_background_color || ""
                ),
              }}
            >
              {link_flair_text}
            </span>
          )}
        </div>
      )
    );
  };
  
  export default LinkFlairText;
