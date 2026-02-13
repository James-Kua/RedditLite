import React from "react";
import { parseUnixTimestamp } from "../utils/datetime";

interface CreatedEditedLabelProps {
  created: number;
  edited?: boolean | number;
}

const CreatedEditedLabel: React.FC<CreatedEditedLabelProps> = ({
  created,
  edited,
}) => {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{parseUnixTimestamp(created)}</span>
      </div>
      
      {typeof edited === "number" && (
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="font-medium">{parseUnixTimestamp(edited)}</span>
        </div>
      )}
    </div>
  );
};

export default CreatedEditedLabel;