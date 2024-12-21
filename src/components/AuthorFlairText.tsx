import { AuthorFlairRichtext } from "../types/comment";
import { parseLinkFlairTextColor } from "../utils/parser";

interface AuthorFlairTextProps {
  author_flair_richtext?: AuthorFlairRichtext[];
  author_flair_text?: string;
  author_flair_background_color?: string;
}

const AuthorFlairText = ({
  author_flair_richtext = [],
  author_flair_text,
  author_flair_background_color,
}: AuthorFlairTextProps) => {
  return (
    (author_flair_richtext.length > 0 || author_flair_text) && (
      <div
        className="rounded-lg p-0.5 text-xs overflow-x-auto w-fit font-medium whitespace-nowrap"
        style={{
          backgroundColor: author_flair_background_color || "#bbbb",
        }}
      >
        {author_flair_richtext.length > 0 ? (
          author_flair_richtext.map(
            (flair: AuthorFlairRichtext, index: number) => (
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
                      backgroundColor: author_flair_background_color || "",
                      color: parseLinkFlairTextColor(
                        author_flair_background_color || ""
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
              backgroundColor: author_flair_background_color || "",
              color: parseLinkFlairTextColor(
                author_flair_background_color || ""
              ),
            }}
          >
            {author_flair_text}
          </span>
        )}
      </div>
    )
  );
};

export default AuthorFlairText;
