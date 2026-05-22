import type { ReactNode } from "react";

import { CheckIcon } from "@/shared/ui/icons";

type SelectOption<T extends string> = {
  label: string;
  value: T;
};

type SelectOptionListProps<T extends string> = {
  onSelect: (value: T) => void;
  options: readonly SelectOption<T>[];
  renderLabel?: (option: SelectOption<T>) => ReactNode;
  selectedValue: T;
};

/**
 * @page  - [공통 UI]
 * @title - 선택 옵션 리스트 컴포넌트
 * @desc  - 드롭다운 형태의 공통 옵션 리스트 렌더링
 */
export function SelectOptionList<T extends string>({
  onSelect,
  options,
  renderLabel,
  selectedValue,
}: SelectOptionListProps<T>) {
  return (
    <div className="absolute top-full left-1/2 z-20 mt-2 w-36 -translate-x-1/2">
      <div className="rounded-[18px] border border-border bg-white p-2 shadow-[0_18px_32px_rgba(23,32,51,0.12)]">
        {options.map((option, index) => (
          <div
            key={option.value}
            className={index === 0 ? undefined : "mt-0.5 border-t border-border/70 pt-0.5"}
          >
            <button
              type="button"
              className={[
                "flex min-h-10 w-full items-center justify-between rounded-xl px-3 py-1 text-sm font-medium transition-colors",
                selectedValue === option.value
                  ? "text-primary"
                  : "text-text-muted hover:bg-surface hover:text-text",
              ].join(" ")}
              onClick={() => {
                onSelect(option.value);
              }}
            >
              <span className="flex min-h-8 items-center">
                {renderLabel ? renderLabel(option) : option.label}
              </span>
              {selectedValue === option.value ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckIcon className="size-3.5" />
                </span>
              ) : null}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
