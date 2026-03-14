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
    <div role="radiogroup" aria-label={label} className="flex rounded-md shadow-sm -space-x-px max-w-full">
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={currentValue === option.value}
          onClick={() => onChange(option.value)}
          className={`relative inline-flex items-center px-2 py-1 border text-xs font-medium whitespace-nowrap focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${index === 0 ? "rounded-l-md" : ""}
            ${index === options.length - 1 ? "rounded-r-md" : ""}
            ${currentValue === option.value
              ? "z-10 bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
        >
          {option.key}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
