export function parsePermalink(permalink: string) {
  const parts = permalink.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return `/${parts.slice(1).join("/")}`;
  }

  return permalink;
}

export function parseImageType(imageType?: string): string {
  console.log(imageType);
  if (!imageType) {
    return "jpg";
  }

  const parts = imageType.split("/");

  return parts.length === 2 ? parts[1] : "jpg";
}
