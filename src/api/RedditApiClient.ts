import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export class RedditApiClient {
  private static rateLimited: boolean = false;
  private static toastShown: boolean = false;
  private static readonly TOAST_TIMEOUT: number = 3000;

  private static isDarkMode() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  static async fetch(url: string): Promise<any> {
    try {
      const response = await fetch(url)

      if (response.ok) {
        this.rateLimited = false;
        return response;
      }
    } catch (error) {
      if (error instanceof TypeError) {
        this.debounceAlert("Reddit rate limit exceeded. Please retry in a few minutes.");
      } else {
        this.debounceAlert("An unexpected error occurred. Please try again later.");
      }

      return null;
    }
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
