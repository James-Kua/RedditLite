import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export type DropdownOption = {
  key: string;
  value: string;
};

type CustomDropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative min-w-28">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:border-blue-400/50 dark:hover:bg-white/10"
      >
        <span>{selectedOption?.key}</span>
        <FaChevronDown className={`h-2.5 w-2.5 text-blue-500 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-40 mt-1 w-full min-w-max overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-neutral-900">
          <div role="listbox" aria-label={label} className="max-h-64 overflow-auto p-1">
            {options.map((option) => {
              const isSelected = option.value === selectedOption?.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full rounded-md px-3 py-1.5 text-left text-xs font-semibold transition ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-blue-300"
                  }`}
                >
                  {option.key}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
