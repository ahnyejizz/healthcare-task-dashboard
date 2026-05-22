"use client";

import { FilterIcon } from "@/shared/ui/icons";
import { SelectOptionList } from "@/shared/ui/select-option-list";
import { StatusBadge } from "@/shared/ui/status-badge";
import { ViewToggleButton } from "@/shared/ui/button/view-toggle-button";
import { type TaskFilter, taskFilterOptions } from "@/widgets/task-list/model/task-list-controls";

type FilterDropdownProps = {
  isOpen: boolean;
  taskFilter: TaskFilter;
  onButtonClick: () => void;
  onSelect: (value: TaskFilter) => void;
};

function renderTaskFilterLabel(option: { label: string; value: TaskFilter }) {
  if (option.value === "all") {
    return <StatusBadge tone="all">전체</StatusBadge>;
  }

  if (option.value === "todo") {
    return <StatusBadge tone="todo">TODO</StatusBadge>;
  }

  if (option.value === "done") {
    return <StatusBadge tone="done">DONE</StatusBadge>;
  }

  return option.label;
}

/**
 * @page  - [할 일 목록]
 * @title - 필터 드롭다운 컴포넌트
 * @desc  - 상태(전체/TODO/DONE) 필터 버튼 제공
 */
export function FilterDropdown({
  isOpen,
  taskFilter,
  onButtonClick,
  onSelect,
}: FilterDropdownProps) {
  return (
    <div className="relative ml-5">
      <ViewToggleButton
        className="bg-white"
        isActive={taskFilter !== "all"}
        label="필터링"
        onClick={onButtonClick}
      >
        <FilterIcon />
      </ViewToggleButton>

      {isOpen ? (
        <SelectOptionList
          options={taskFilterOptions}
          renderLabel={renderTaskFilterLabel}
          selectedValue={taskFilter}
          onSelect={onSelect}
        />
      ) : null}
    </div>
  );
}
