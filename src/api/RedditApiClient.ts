import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Comment } from "../types/comment";
import { Post } from "../types/post";
import { Subreddit, SubredditRules } from "../types/subreddit";
import { UserProfile } from "../types/user";

const ARCTIC_SHIFT_BASE_URL = "https://arctic-shift.photon-reddit.com";
const DEFAULT_PAGE_SIZE = 50;
const TOP_SCAN_SEGMENTS = 10;
const TOP_SCAN_REQUESTS_PER_SEGMENT = 14;
const TOP_SCAN_MAX_WINDOW = 30 * 24 * 60 * 60;
const TOP_RESULT_LIMIT = 100;

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

type GetPostsOptions = {
  subreddit?: string;
  author?: string;
  query?: string;
  cursor?: string | null;
  time?: string;
  sort?: string;
  limit?: number;
};

type ScoredPostRef = {
  id: string;
  score: number;
  created_utc: number;
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

  /**
   * Pages one slice of the time window from newest to oldest, recording every
   * score it sees. Stops at the slice boundary, when the feed runs dry, or once
   * the request budget is spent — a spent budget means the slice was too busy
   * to scan fully, so the ranking becomes a sample of it rather than the whole.
   */
  private static async scanSegment(
    options: GetPostsOptions,
    bounds: { after: number; before: number },
    scores: Map<string, number>,
  ) {
    let before = bounds.before;

    for (let request = 0; request < TOP_SCAN_REQUESTS_PER_SEGMENT; request += 1) {
      const items = await this.request<ScoredPostRef>("/api/posts/search", {
        subreddit: options.subreddit,
        author: options.author,
        after: bounds.after,
        before,
        sort: "desc",
        limit: "auto",
        fields: "id,score,created_utc",
      });

      if (items.length === 0) break;

      items.forEach((item) => scores.set(item.id, item.score));

      const oldest = items[items.length - 1].created_utc;
      if (oldest >= before) break;

      before = oldest;
      if (oldest <= bounds.after) break;
    }
  }

  /**
   * Arctic Shift can only sort by `created_utc`, so a score ranking has to be
   * built client side by walking the whole time window. The walk asks for ids
   * and scores only (a few KB per request) and full posts are hydrated later,
   * one page at a time. The window is split into segments scanned in parallel:
   * it keeps the wall time down, and when a subreddit is too busy to scan
   * exhaustively the shortfall is spread evenly across the window instead of
   * lopping off everything older than the first few days.
   */
  private static async scanWindowByScore(options: GetPostsOptions): Promise<string[]> {
    const now = Math.floor(Date.now() / 1000);
    const start = this.afterForTime(options.time ?? "all") ?? now - TOP_SCAN_MAX_WINDOW;
    const segment = Math.ceil((now - start) / TOP_SCAN_SEGMENTS);
    const scores = new Map<string, number>();

    await Promise.all(
      Array.from({ length: TOP_SCAN_SEGMENTS }, (_, index) =>
        this.scanSegment(
          options,
          {
            after: start + index * segment,
            before: index === TOP_SCAN_SEGMENTS - 1 ? now : start + (index + 1) * segment,
          },
          scores,
        ),
      ),
    );

    return [...scores]
      .sort(([, leftScore], [, rightScore]) => rightScore - leftScore)
      .map(([id]) => id);
  }

  /**
   * Returns the whole ranking in one page. Paging it would mean either holding
   * the scan between calls or re-running it per page, so the feed takes the top
   * slice up front and stops there.
   */
  private static async getTopPosts(options: GetPostsOptions): Promise<ArcticShiftPage<Post>> {
    const ranking = (await this.scanWindowByScore(options)).slice(0, TOP_RESULT_LIMIT);

    if (ranking.length === 0) {
      return { items: [], nextCursor: null };
    }

    const posts = await this.request<Post>("/api/posts/ids", { ids: ranking.join(","), md2html: true });
    const postsById = new Map(posts.map((post) => [post.id, post]));

    return {
      items: ranking
        .map((id) => postsById.get(id))
        .filter((post): post is Post => !!post && !this.isRemovedPost(post)),
      nextCursor: null,
    };
  }

  static async getPosts(options: GetPostsOptions): Promise<ArcticShiftPage<Post>> {
    // Ranking a keyword search would need the same multi-request scan, but
    // those run on Arctic Shift's 5 requests/minute limit — fall back to time.
    if (options.sort === "top" && !options.query) {
      return this.getTopPosts(options);
    }

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
