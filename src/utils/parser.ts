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
