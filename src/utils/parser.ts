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

export function parseLinkFlairTextColor(color: string) {
  if (color === "dark") {
    return "black";
  }

  return "white";
}
