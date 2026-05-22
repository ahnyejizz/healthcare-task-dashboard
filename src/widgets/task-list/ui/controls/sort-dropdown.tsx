"use client";

import { SortDirectionIcon, SortIcon } from "@/shared/ui/icons";
import { SelectOptionList } from "@/shared/ui/select-option-list";
import { ViewToggleButton } from "@/shared/ui/button/view-toggle-button";
import {
  type TaskSort,
  type TaskSortOrder,
  taskSortOptions,
} from "@/widgets/task-list/model/task-list-controls";

type SortDropdownProps = {
  isSortOpen: boolean;
  taskSort: TaskSort;
  taskSortOrder: TaskSortOrder;
  onSortButtonClick: () => void;
  onSortOrderToggle: () => void;
  onSortSelect: (value: TaskSort) => void;
};

/**
 * @page  - [할 일 목록]
 * @title - 정렬 드롭다운 컴포넌트
 * @desc  - 정렬 기준(태스크ID/태스크명) 및 방향(오름차순/내림차순) 버튼 제공
 */
export function SortDropdown({
  isSortOpen,
  taskSort,
  taskSortOrder,
  onSortButtonClick,
  onSortOrderToggle,
  onSortSelect,
}: SortDropdownProps) {
  return (
    <>
      <div className="relative">
        <ViewToggleButton
          className="bg-white"
          isActive={isSortOpen || taskSort !== "TASK_ID"}
          label="정렬"
          onClick={onSortButtonClick}
        >
          <SortIcon />
        </ViewToggleButton>

        {isSortOpen ? (
          <SelectOptionList
            options={taskSortOptions}
            selectedValue={taskSort}
            onSelect={onSortSelect}
          />
        ) : null}
      </div>

      <ViewToggleButton
        className="bg-white"
        isActive={taskSortOrder === "desc"}
        label={taskSortOrder === "desc" ? "내림차순 정렬" : "오름차순 정렬"}
        onClick={onSortOrderToggle}
      >
        <SortDirectionIcon direction={taskSortOrder} />
      </ViewToggleButton>
    </>
  );
}
