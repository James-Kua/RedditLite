import React from "react";

interface CustomTagProps {
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  content?: string;
}

const CustomTag: React.FC<CustomTagProps> = ({
  fontSize = "text-xs",
  color = "text-black",
  backgroundColor = "bg-slate-50",
  content = "",
}) => {
  return (
    <span
      className={`whitespace-nowrap rounded-lg ${backgroundColor} p-1 overflow-x-auto w-fit inline-block my-1`}
    >
      <p className={`whitespace-nowrap ${fontSize} ${color} font-medium`}>
        {content}
      </p>
    </span>
  );
};

export default CustomTag;
