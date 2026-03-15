import React from "react";

interface Option {
  key: string;
  value: string;
}

interface SegmentedControlProps {
  options: Option[];
  currentValue: string;
  onChange: (value: string) => void;
  label?: string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, currentValue, onChange, label }) => {
  return (
    <div role="radiogroup" aria-label={label} className="flex shadow-sm max-w-full gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={currentValue === option.value}
          onClick={() => onChange(option.value)}
          className={`p-1 rounded-md text-xs font-semibold capitalize transition-all whitespace-nowrap shrink-0 border border-transparent focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${currentValue === option.value
              ? "bg-blue-400 text-white"
              : "text-zinc-500 hover:text-blue-400 hover:bg-white/5"
            }`}
        >
          {option.key}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
