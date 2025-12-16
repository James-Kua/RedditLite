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
      const headers = {
        "accept": "application/json, text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) " +
          "AppleWebKit/605.1.15 (KHTML, like Gecko) " +
          "Version/17.0 Mobile/15E148 Safari/604.1",
      };

      const response = await fetch(
        url,
        { headers }
      );

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
