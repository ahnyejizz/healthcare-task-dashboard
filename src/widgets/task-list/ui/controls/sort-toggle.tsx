"use client";

import { SortIcon } from "@/shared/ui/icons";
import { ViewToggleButton } from "@/shared/ui/button/view-toggle-button";
import { type TaskSortOrder } from "@/widgets/task-list/model/task-list-controls";

type SortToggleProps = {
  taskSortOrder: TaskSortOrder;
  onToggle: () => void;
};

/**
 * @page  - [할 일 목록]
 * @title - 정렬 방향 토글 컴포넌트
 * @desc  - 클릭 시 오름차순/내림차순 정렬을 즉시 전환하는 토글 버튼
 */
export function SortToggle({ taskSortOrder, onToggle }: SortToggleProps) {
  return (
    <ViewToggleButton
      className="bg-white"
      isActive={taskSortOrder === "desc"}
      label={taskSortOrder === "asc" ? "오름차순 정렬" : "내림차순 정렬"}
      onClick={onToggle}
    >
      <SortIcon direction={taskSortOrder} />
    </ViewToggleButton>
  );
}
