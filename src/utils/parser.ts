export function parsePermalink(permalink: string) {
    const parts = permalink.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `/${parts.slice(1).join("/")}`;
    }
  
    return permalink;
  }