import { useEffect } from "react";
import { toast } from "react-toastify";

const SITE_STATUS_TOAST_ID = "reddit-site-status";

const SiteStatusToast = () => {
  useEffect(() => {
    if (toast.isActive(SITE_STATUS_TOAST_ID)) {
      return;
    }

    const isDarkMode =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    toast.warn(
      (
        <div className="space-y-2 rounded-md ">
          <p className="text-sm font-semibold">This site is no longer functioning.</p>
          <p className="text-sm leading-6">
            Reddit has deprecated unauthenticated JSON endpoints. Please visit{" "}
            <a
              href="https://reddit-arctic-lite.pages.dev"
              className="font-semibold underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              reddit-arctic-lite.pages.dev
            </a>
            {" "}instead (limited features).
          </p>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center",
        toastId: SITE_STATUS_TOAST_ID,
        style: {
          backgroundColor: isDarkMode ? "#111827" : "#fff7ed",
          border: `1px solid ${isDarkMode ? "#374151" : "#fdba74"}`,
          color: isDarkMode ? "#f9fafb" : "#7c2d12",
          boxShadow: isDarkMode
            ? "0 12px 30px rgba(0, 0, 0, 0.35)"
            : "0 12px 30px rgba(154, 52, 18, 0.12)",
          maxWidth: "40rem",
          width: "min(40rem, calc(100vw - 2rem))",
        },
      },
    );
  }, []);

  return null;
};

export default SiteStatusToast;
