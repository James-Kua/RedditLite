import React from "react";
import he from "he";

export type PollDataProps = {
  poll_data?: {
    options: {
      text: string;
      vote_count: number;
      id: string;
    }[];
    total_vote_count: number;
    user_selection?: string;
    voting_end_timestamp: string;
  };
};

const PollData: React.FC<PollDataProps> = ({ poll_data }) => {
  if (!poll_data || !poll_data.options || poll_data.options.length === 0) {
    return null;
  }

  const { options = [], total_vote_count = 0, user_selection, voting_end_timestamp } = poll_data;
  
  const currentTimestamp = new Date();
  const endTimestamp = new Date(voting_end_timestamp);
  const isPollOpen = currentTimestamp < endTimestamp;
  
  const remainingTime = endTimestamp.getTime() - currentTimestamp.getTime();
  
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || days <= 0) parts.push(`${minutes}m`);
  
  const remainingTimeText = parts.join(" ");

  const getPercentage = (votes: number | undefined) => {
    const v = votes || 0;
    if (total_vote_count === 0) return 0;
    return Math.round((v / total_vote_count) * 100);
  };

  return (
    <div className="w-full mx-auto p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700 mt-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Poll</h3>
        {isPollOpen ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {remainingTimeText} left
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ended
          </span>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const percentage = getPercentage(option?.vote_count);
          const isSelected = user_selection === option.id;
          const votes = (option?.vote_count || 0);
          const isWinner = votes === Math.max(...options.map((o) => (o?.vote_count || 0))) && total_vote_count > 0;

          return (
            <div key={option.id} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                  {he.decode(option.text)}
                  {isSelected && (
                    <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded">
                      YOU
                    </span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 relative h-5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out min-w-[2px] ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500 to-blue-400"
                        : isWinner && !isPollOpen
                        ? "bg-gradient-to-r from-amber-400 to-orange-400"
                        : "bg-gradient-to-r from-gray-400 to-gray-500 dark:from-slate-500 dark:to-slate-400"
                    }`}
                    style={{ width: percentage > 0 ? `${percentage}%` : "2px" }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 min-w-[60px] text-right">
                  {votes.toLocaleString()} ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {total_vote_count.toLocaleString()} {total_vote_count === 1 ? "vote" : "votes"} total
        </span>
        
        {user_selection && (
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            You voted
          </span>
        )}
      </div>
    </div>
  );
};

export default PollData;