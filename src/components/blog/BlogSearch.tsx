'use client';

import { useState, useEffect, useRef } from 'react';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * BlogSearch component with debounced input (300ms).
 * Minimum 2 characters to activate search.
 * Clears results when input is below 2 chars.
 *
 * Requirements: 8.7
 */
export function BlogSearch({ onSearch, placeholder = 'Search articles...' }: BlogSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      // Only trigger search if 2+ chars, otherwise clear
      if (inputValue.length >= 2) {
        onSearch(inputValue);
      } else {
        onSearch('');
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-[var(--foreground-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search blog articles"
        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm
          bg-[var(--background-secondary)] text-[var(--foreground)]
          border border-[var(--border)]
          placeholder:text-[var(--foreground-muted)]
          focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent
          transition-all duration-200"
      />

      {/* Clear button */}
      {inputValue.length > 0 && (
        <button
          type="button"
          onClick={() => setInputValue('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 touch-target"
          aria-label="Clear search"
        >
          <svg
            className="w-4 h-4 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
