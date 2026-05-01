import { Post } from "../types/post";

export function parsePermalink(permalink: string) {
  const parts = permalink.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return `/r/${parts.slice(1).join("/")}`;
  }

  return permalink;
}

export function parseImageType(imageType?: string): string {
  if (!imageType) {
    return "jpg";
  }

  const parts = imageType.split("/");

  return parts.length === 2 ? parts[1] : "jpg";
}

export function isImage(url: string) {
  return url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg");
}

export function parseLinkFlairTextColor(backgroundColor: string) {
  const isColorLight = (color: string) => {
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (!rgb) return false;

    const [r, g, b] = rgb.slice(1).map((hex) => parseInt(hex, 16));
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5;
  };

  const isBackgroundLight = isColorLight(backgroundColor);

  return isBackgroundLight ? "black" : "white";
}


export function parseInlineImagesFromHtml(html: string) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const links = tempDiv.querySelectorAll("a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const giphyId = parseGiphyId(href);

    if (giphyId) {
      const gif = document.createElement("img");
      gif.src = `https://media.giphy.com/media/${giphyId}/giphy.gif`;
      gif.alt = link.textContent || "Giphy GIF";
      gif.loading = "lazy";
      gif.style.display = "block";
      gif.style.maxWidth = "100%";
      gif.style.width = "min(320px, 100%)";
      gif.style.height = "auto";
      gif.style.maxHeight = "220px";
      gif.style.objectFit = "contain";
      gif.style.margin = "0";
      gif.style.borderRadius = "0.5rem";

      const newLink = document.createElement("a");
      newLink.href = href;
      newLink.target = "_blank";
      newLink.rel = "noopener noreferrer";
      newLink.style.display = "block";
      newLink.style.width = "fit-content";
      newLink.appendChild(gif);

      const figure = document.createElement("figure");
      figure.style.display = "block";
      figure.style.margin = "0.35rem 0 0.75rem";
      figure.style.textAlign = "left";
      figure.appendChild(newLink);

      link.replaceWith(figure);
    } else if (/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/.test(href)) {
      const img = document.createElement("img");
      img.src = href;
      img.alt = link.textContent || "";
      img.style.display = "block";
      img.style.margin = "0 auto";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.maxHeight = "50vh";
      img.style.borderRadius = "0.5rem";
      img.style.marginTop = "0.5rem";

      const newLink = document.createElement("a");
      newLink.href = href;
      newLink.target = "_blank";
      newLink.rel = "noopener noreferrer";
      newLink.appendChild(img);

      const captionText = link.textContent || "Image";
      const caption = document.createElement("figcaption");
      caption.style.textAlign = "center";
      caption.style.marginTop = "0.5rem";
      caption.style.marginBottom = "0.5rem";
      caption.style.fontSize = "0.9em";
      caption.style.fontWeight = "500";
      caption.style.color = "#666";
      caption.textContent = captionText;

      const figure = document.createElement("figure");
      figure.appendChild(newLink);
      figure.appendChild(caption);

      link.replaceWith(figure);
    }
  });

  return tempDiv.innerHTML;
}

function parseGiphyId(url: string) {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    if (parsedUrl.hostname !== "giphy.com" && parsedUrl.hostname !== "www.giphy.com") {
      return null;
    }

    const [, type, slugOrId] = parsedUrl.pathname.split("/");
    if (type !== "gifs" || !slugOrId) {
      return null;
    }

    return slugOrId.split("-").pop() || null;
  } catch {
    return null;
  }
}

export const getPostType = (post: Post): 'image' | 'video' | 'text' | 'link' | 'gallery' => {
  if (post.gallery_data) {
    return 'gallery';
  }
  if (post.secure_media?.reddit_video || post.secure_media_embed?.content) {
    return 'video';
  }
  if (post.post_hint === 'image') {
    return 'image';
  }
  if (post.post_hint === 'link') {
    return 'link';
  }
  if (post.selftext_html) {
    return 'text';
  }
  return 'link';
};
