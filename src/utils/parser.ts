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
    if (href && /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/.test(href)) {
      const img = document.createElement("img");
      img.src = href;
      img.alt = link.textContent || "";
      img.style.display = "block";
      img.style.margin = "0 auto";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.maxHeight = "50vh";

      const newLink = document.createElement("a");
      newLink.href = href;
      newLink.target = "_blank";
      newLink.rel = "noopener noreferrer";
      newLink.appendChild(img);

      const captionText = link.textContent || "Image";
      const caption = document.createElement("figcaption");
      caption.style.textAlign = "center";
      caption.style.marginTop = "8px";
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
};