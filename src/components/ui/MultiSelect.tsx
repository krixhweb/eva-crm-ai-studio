import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "./DropdownMenu";
import { Icon } from "../icons/Icon";
import { cn } from "../../lib/utils";

interface MultiSelectProps {
  label?: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: MultiSelectProps) {
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, search]);

  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  const selectAll = () => onChange([...options]);
  const clearAll = () => onChange([]);

  const displayLabel = useMemo(() => {
    if (value.length === 0) return `${label ? label + ": " : ""}None`;
    if (value.length === options.length) return `${label ? label + ": " : ""}All`;
    if (value.length <= 2) return `${label ? label + ": " : ""}${value.join(", ")}`;
    return `${label ? label + ": " : ""}${value.slice(0, 2).join(", ")} +${value.length - 2}`;
  }, [value, options, label]);

  // Keyboard navigation
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const item = filtered[highlight];
        if (item) toggle(item);
      }
    };

    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [filtered, highlight]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-between border rounded-md bg-white dark:bg-gray-800 text-sm px-3 h-9 w-full",
            className
          )}
        >
          <span className="truncate text-gray-700 dark:text-gray-200">
            {displayLabel || placeholder}
          </span>
          <Icon name="chevronDown" className="h-4 w-4 ml-2 text-gray-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <div className="p-3 space-y-2">

          {/* Search */}
          <input
            className="w-full border rounded-md px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlight(0);
            }}
          />

          {/* Actions */}
          <div className="flex justify-between text-xs">
            <button
              onClick={selectAll}
              className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Select all
            </button>
            <button
              onClick={clearAll}
              className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Clear
            </button>
          </div>

          {/* Items */}
          <div
            ref={listRef}
            tabIndex={0}
            className="max-h-48 overflow-auto space-y-1 outline-none"
          >
            {filtered.map((opt, i) => {
              const checked = value.includes(opt);
              return (
                <div
                  key={opt}
                  onClick={() => toggle(opt)}
                  onMouseEnter={() => setHighlight(i)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded cursor-pointer",
                    checked
                      ? "bg-green-100 dark:bg-green-800/40"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700",
                    i === highlight && "ring-2 ring-green-400"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-sm flex items-center justify-center border",
                      checked
                        ? "bg-green-600 border-green-600"
                        : "border-gray-300 dark:border-gray-600"
                    )}
                  >
                    {checked && (
                      <Icon name="check" className="h-3 w-3 text-white" />
                    )}
                  </div>

                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {opt}
                  </span>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-gray-500 text-xs">No results</p>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
