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
    <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 font-medium hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
      <span className="mr-1 text-gray-400 dark:text-slate-500">•</span>
      <span>{parseUnixTimestamp(created)}</span>
      
      {typeof edited === "number" && (
        <span className="ml-1 italic font-normal text-gray-400 dark:text-slate-500">
          • edited {parseUnixTimestamp(edited)}
        </span>
      )}
    </div>
  );
};

export default CreatedEditedLabel;