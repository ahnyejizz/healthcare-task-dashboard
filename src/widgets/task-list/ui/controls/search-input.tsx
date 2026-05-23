"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { CheckIcon, ChevronDownIcon, CloseIcon, SearchIcon } from "@/shared/ui/icons";
import { type SearchField, searchFieldOptions } from "@/widgets/task-list/model/task-list-controls";

type SearchBarProps = {
  searchField: SearchField;
  value: string;
  onChange: (value: string) => void;
  onFieldChange: (field: SearchField) => void;
};

/**
 * @page  - [할 일 목록]
 * @title - 검색 컴포넌트
 * @desc  - 검색 필드(전체/태스크ID/태스크명/메모) 선택 및 검색어 입력 제공
 */
export function SearchBar({ searchField, value, onChange, onFieldChange }: SearchBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = searchFieldOptions.find((o) => o.value === searchField)?.label ?? "전체";

  // 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    if (!isDropdownOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isDropdownOpen]);

  return (
    <div ref={containerRef} className="relative">
      {/* 통합 검색 컨테이너 */}
      <div className="focus-within-ring flex h-9 w-80 items-center rounded-xl border border-border bg-white">
        {/* 좌측: 검색 필드 선택 버튼 */}
        <button
          type="button"
          aria-label="검색 기준 선택"
          className={cn(
            "flex h-full w-30 shrink-0 items-center justify-between rounded-l-xl pl-3 pr-2 text-xs font-medium transition-colors",
            searchField !== "all" ? "text-primary" : "text-text-muted hover:text-text",
          )}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <span>{selectedLabel}</span>
          <ChevronDownIcon
            className={cn(
              "h-3 w-3 transition-transform duration-150",
              isDropdownOpen && "rotate-180",
            )}
          />
        </button>

        {/* 구분선 */}
        <span className="h-4 w-px shrink-0 bg-border/70" />

        {/* 우측: 검색어 입력 영역 */}
        <div className="relative flex flex-1 items-center">
          <span className="pointer-events-none absolute left-2.5 flex items-center text-text-muted/60">
            <SearchIcon className="h-3.5 w-3.5" />
          </span>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="검색어 입력"
            aria-label="할 일 검색"
            className={cn(
              "h-full w-full bg-transparent py-2 pl-8 text-xs text-text placeholder:text-text-muted/60 outline-none",
              value ? "pr-7" : "pr-3",
            )}
          />

          {value ? (
            <button
              type="button"
              aria-label="검색어 초기화"
              className="absolute right-2 flex items-center text-text-muted/60 hover:text-text-muted"
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      </div>

      {/* 필드 선택 드롭다운 목록 */}
      {isDropdownOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-30">
          <div className="rounded-[18px] border border-border bg-white p-2 shadow-[0_18px_32px_rgba(23,32,51,0.12)]">
            {searchFieldOptions.map((option, index) => (
              <div
                key={option.value}
                className={index === 0 ? undefined : "mt-0.5 border-t border-border/70 pt-0.5"}
              >
                <button
                  type="button"
                  className={cn(
                    "flex min-h-9 w-full items-center justify-between rounded-xl px-3 py-1 text-xs font-medium transition-colors",
                    searchField === option.value
                      ? "text-primary"
                      : "text-text-muted hover:bg-surface hover:text-text",
                  )}
                  onClick={() => {
                    onFieldChange(option.value as SearchField);
                    setIsDropdownOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {searchField === option.value ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckIcon className="size-3.5" />
                    </span>
                  ) : null}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
