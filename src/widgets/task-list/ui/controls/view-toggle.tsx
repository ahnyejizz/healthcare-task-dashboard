"use client";

import { CardViewIcon, ListViewIcon } from "@/shared/ui/icons";
import { ViewToggleButton } from "@/shared/ui/view-toggle-button";
import { type TaskListViewMode } from "@/widgets/task-list/model/task-list-controls";

type ViewToggleProps = {
  viewMode: TaskListViewMode;
  onCardViewClick: () => void;
  onListViewClick: () => void;
};

/**
 * @page  - [할 일 목록]
 * @title - 뷰 전환 토글 컴포넌트
 * @desc  - 카드형/리스트형 토글 버튼 제공
 */
export function ViewToggle({ viewMode, onCardViewClick, onListViewClick }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <ViewToggleButton
        isActive={viewMode === "card"}
        label="카드형 보기"
        onClick={onCardViewClick}
      >
        <CardViewIcon />
      </ViewToggleButton>

      <ViewToggleButton
        isActive={viewMode === "list"}
        label="리스트형 보기"
        onClick={onListViewClick}
      >
        <ListViewIcon />
      </ViewToggleButton>
    </div>
  );
}
