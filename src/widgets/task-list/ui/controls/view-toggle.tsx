"use client";

import { CardViewIcon, ListViewIcon } from "@/shared/ui/icons";
import { ViewToggleButton } from "@/shared/ui/view-toggle-button";
import { type TaskListViewMode } from "@/widgets/task-list/model/task-list-controls";

type ViewToggleProps = {
  viewMode: TaskListViewMode;
  onCardViewClick: () => void;
  onListViewClick: () => void;
};

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
