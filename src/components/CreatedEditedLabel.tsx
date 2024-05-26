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
    <span className="flex space-x-1 whitespace-nowrap w-fit text-xs">
      <h3 className="whitespace-nowrap font-medium">
        🕔 {parseUnixTimestamp(created)}
      </h3>
      {typeof edited === "number" && (
        <h3 className="font-medium">✏️ Edited {parseUnixTimestamp(edited)}</h3>
      )}
    </span>
  );
};

export default CreatedEditedLabel;
