// 필터링
export type TaskFilter = "all" | "done" | "todo";

export const taskFilterOptions = [
  { value: "all", label: "전체" },
  { value: "todo", label: "TODO" },
  { value: "done", label: "DONE" },
] as const;

// 정렬
export type TaskSortOrder = "asc" | "desc";

// 검색
export type SearchField = "all" | "TASK_ID" | "TASK_NAME" | "MEMO";

export const searchFieldOptions = [
  { value: "all", label: "전체" },
  { value: "TASK_ID", label: "태스크ID" },
  { value: "TASK_NAME", label: "태스크명" },
  { value: "MEMO", label: "메모" },
] as const;

// 뷰 모드
export type TaskListViewMode = "card" | "list";
