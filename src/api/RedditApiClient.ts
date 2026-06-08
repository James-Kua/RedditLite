import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Comment } from "../types/comment";
import { Post } from "../types/post";
import { Subreddit, SubredditRules } from "../types/subreddit";
import { UserProfile } from "../types/user";

const ARCTIC_SHIFT_BASE_URL = "https://arctic-shift.photon-reddit.com";
const DEFAULT_PAGE_SIZE = 50;

type QueryValue = string | number | boolean | null | undefined;

type ArcticShiftResponse<T> = {
  data: T[];
};

export type ArcticShiftPage<T> = {
  items: T[];
  nextCursor: string | null;
};

type CommentTreeItem = {
  kind: string;
  data: Comment;
};

type ArcticShiftRuleGroup = {
  rules: Array<SubredditRules & { description?: string }>;
};

type ArcticShiftUser = {
  author: string;
  _meta?: {
    post_karma?: number;
    comment_karma?: number;
    total_karma?: number;
  };
};

export class RedditApiClient {
  private static rateLimited = false;
  private static toastShown = false;
  private static readonly TOAST_TIMEOUT = 3000;

  private static isDarkMode() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  private static buildUrl(path: string, params: Record<string, QueryValue> = {}) {
    const url = new URL(path, ARCTIC_SHIFT_BASE_URL);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  }

  private static async request<T>(path: string, params: Record<string, QueryValue> = {}): Promise<T[]> {
    try {
      const response = await fetch(this.buildUrl(path, params), {
        headers: {
          accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        this.rateLimited = response.status === 429;
        throw new Error(`Arctic Shift request failed with status ${response.status}`);
      }

      this.rateLimited = false;
      const payload = (await response.json()) as ArcticShiftResponse<T>;
      return payload.data ?? [];
    } catch (error) {
      const message = this.rateLimited
        ? "Arctic Shift rate limit exceeded. Please retry in a few minutes."
        : "Arctic Shift is unavailable. Please try again later.";
      this.debounceAlert(message);
      throw error;
    }
  }

  private static page<T extends { created_utc: number }>(
    items: T[],
    rawItems: Array<{ created_utc: number }>,
    limit: number,
  ): ArcticShiftPage<T> {
    const lastItem = rawItems[rawItems.length - 1];
    return {
      items,
      nextCursor: rawItems.length === limit && lastItem ? String(lastItem.created_utc) : null,
    };
  }

  private static isPlaceholderText(value?: string | null) {
    if (!value) return false;

    const normalized = value
      .replace(/<[^>]*>/g, "")
      .replace(/&(?:#39|apos);/g, "'")
      .trim()
      .toLowerCase();

    return /^\[\s*(?:deleted|removed(?: by [^\]]+)?)\s*\]$/.test(normalized);
  }

  private static isRemovedPost(post: Post) {
    return (
      this.isPlaceholderText(post.title) ||
      this.isPlaceholderText(post.selftext) ||
      this.isPlaceholderText(post.selftext_html) ||
      this.isPlaceholderText(post.body_html)
    );
  }

  private static afterForTime(time: string): number | undefined {
    const durations: Record<string, number> = {
      hour: 60 * 60,
      day: 24 * 60 * 60,
      week: 7 * 24 * 60 * 60,
      month: 30 * 24 * 60 * 60,
      year: 365 * 24 * 60 * 60,
    };
    const duration = durations[time];
    return duration ? Math.floor(Date.now() / 1000) - duration : undefined;
  }

  static async getPosts(options: {
    subreddit?: string;
    author?: string;
    query?: string;
    cursor?: string | null;
    time?: string;
    sort?: string;
    limit?: number;
  }): Promise<ArcticShiftPage<Post>> {
    const limit = options.limit ?? DEFAULT_PAGE_SIZE;
    const isAscending = options.sort === "oldest";
    const items = await this.request<Post>("/api/posts/search", {
      subreddit: options.subreddit,
      author: options.author,
      query: options.query,
      before: isAscending ? undefined : options.cursor,
      after: isAscending
        ? options.cursor ?? this.afterForTime(options.time ?? "all")
        : this.afterForTime(options.time ?? "all"),
      sort: isAscending ? "asc" : "desc",
      limit,
      md2html: true,
    });
    const visibleItems = items.filter((post) => !this.isRemovedPost(post));

    return this.page(visibleItems, items, limit);
  }

  static async getPost(postId: string): Promise<Post | undefined> {
    const posts = await this.request<Post>("/api/posts/ids", {
      ids: postId,
      md2html: true,
    });
    return posts.find((post) => !this.isRemovedPost(post));
  }

  static async getCommentTree(postId: string, commentId?: string): Promise<Comment[]> {
    const tree = await this.request<CommentTreeItem>("/api/comments/tree", {
      link_id: postId,
      parent_id: commentId,
      limit: 9999,
      md2html: true,
    });

    return tree.filter((item) => item.kind === "t1").map((item) => item.data);
  }

  static async getUserComments(username: string): Promise<Post[]> {
    const comments = await this.request<Comment>("/api/comments/search", {
      author: username,
      limit: 100,
      sort: "desc",
      md2html: true,
    });
    return (comments as unknown as Post[]).filter((comment) => !this.isRemovedPost(comment));
  }

  static async getSubreddit(name: string): Promise<Subreddit | undefined> {
    const subreddits = await this.request<Subreddit>("/api/subreddits/search", {
      subreddit: name,
      limit: 1,
    });
    return subreddits[0];
  }

  static async searchSubreddits(query: string, limit = 6): Promise<Subreddit[]> {
    return this.request<Subreddit>("/api/subreddits/search", {
      subreddit_prefix: query.replace(/^r\//i, ""),
      limit,
    });
  }

  static async getSubredditRules(name: string): Promise<SubredditRules[]> {
    const groups = await this.request<ArcticShiftRuleGroup>("/api/subreddits/rules", {
      subreddits: name,
    });

    return (groups[0]?.rules ?? []).map((rule) => ({
      ...rule,
      description: rule.description ?? "",
    }));
  }

  static async getUser(username: string): Promise<UserProfile | null> {
    const users = await this.request<ArcticShiftUser>("/api/users/search", {
      author: username,
      limit: 1,
    });
    const user = users[0];

    if (!user) return null;

    return {
      awardee_karma: 0,
      awarder_karma: 0,
      icon_img: "",
      link_karma: user._meta?.post_karma ?? 0,
      total_karma: user._meta?.total_karma ?? 0,
      name: user.author,
      snoovatar_img: "",
      comment_karma: user._meta?.comment_karma ?? 0,
    };
  }

  static isRateLimited(): boolean {
    return this.rateLimited;
  }

  private static debounceAlert(message: string): void {
    if (this.toastShown) return;

    this.toastShown = true;

    const darkMode = this.isDarkMode();
    toast.error(message, {
      position: "top-center",
      autoClose: this.TOAST_TIMEOUT,
      style: {
        backgroundColor: darkMode ? "#333" : "#fff",
        borderRadius: "0.5rem",
        color: darkMode ? "#fff" : "#000",
        fontSize: "0.9rem",
      },
    });

    setTimeout(() => {
      this.toastShown = false;
    }, this.TOAST_TIMEOUT);
  }
}
