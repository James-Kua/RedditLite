import React from "react";

interface TopPosterStatusBarProps {
  topPosters: [string, number][];
}

const TopPosterStatusBar: React.FC<TopPosterStatusBarProps> = ({ topPosters }) => {
  if (topPosters.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-200 dark:bg-neutral-900 py-2 border-t border-gray-300 dark:border-gray-700 text-sm z-40 shadow-lg hidden md:block">
      <div className="max-w-[95vw] mx-auto flex items-center justify-center gap-x-4 px-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <span className="font-bold text-gray-800 dark:text-gray-200 shrink-0">Top Posters:</span>
        {topPosters.map(([author, count]) => (
          <React.Fragment key={author}>
            <a href={`/user/${author}`} className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-300/70 dark:bg-zinc-800/70 text-[11px] text-zinc-700 dark:text-zinc-400 hover:text-white hover:bg-zinc-700/70 transition-colors">
              <span className="text-zinc-600">u/</span>
              <span>{author}</span>
              <span className="text-zinc-600 text-[10px]">{count}</span>
            </a>

          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TopPosterStatusBar;
