type SelectOption<T extends string> = {
  label: string;
  value: T;
};

type SelectOptionListProps<T extends string> = {
  onSelect: (value: T) => void;
  options: readonly SelectOption<T>[];
  selectedValue: T;
};

export function SelectOptionList<T extends string>({
  onSelect,
  options,
  selectedValue,
}: SelectOptionListProps<T>) {
  return (
    <div className="rounded-[18px] border border-border bg-white p-2 shadow-[0_18px_32px_rgba(23,32,51,0.12)]">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={[
            "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors",
            selectedValue === option.value
              ? "bg-surface-muted text-primary"
              : "text-text-muted hover:bg-surface hover:text-text",
          ].join(" ")}
          onClick={() => {
            onSelect(option.value);
          }}
        >
          <span>{option.label}</span>
          {selectedValue === option.value ? (
            <span className="text-xs font-semibold text-primary">적용</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
