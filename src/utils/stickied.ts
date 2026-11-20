import type { Post } from "../types/post";

export const STICKIED_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function isRecentStickied(post: Pick<Post, "stickied" | "created_utc">, now = Date.now()) {
  const age = now - post.created_utc * 1000;
  return post.stickied === true && age >= 0 && age < STICKIED_MAX_AGE_MS;
}

export function prioritizeStickied<T extends Pick<Post, "id" | "stickied" | "created_utc">>(
  posts: T[],
  recentPosts: T[],
  now = Date.now(),
): T[] {
  const postsById = new Map(recentPosts.filter((post) => isRecentStickied(post, now)).map((post) => [post.id, post]));
  posts.forEach((post) => postsById.set(post.id, post));
  const items = [...postsById.values()];
  return [
    ...items.filter((post) => isRecentStickied(post, now)).sort((a, b) => b.created_utc - a.created_utc),
    ...posts.filter((post) => !isRecentStickied(post, now)),
  ];
}
