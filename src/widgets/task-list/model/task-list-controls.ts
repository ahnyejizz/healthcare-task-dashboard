export type TaskFilter = "all" | "done" | "todo";

export type TaskSort = "TASK_ID" | "TASK_NAME";
export type TaskSortOrder = "asc" | "desc";

export type TaskListViewMode = "card" | "list";

export const taskFilterOptions = [
  { value: "all", label: "전체" },
  { value: "todo", label: "TODO" },
  { value: "done", label: "DONE" },
] as const;

export const taskSortOptions = [
  { value: "TASK_ID", label: "태스크ID" },
  { value: "TASK_NAME", label: "태스크명" },
] as const;

export type SearchField = "all" | "TASK_ID" | "TASK_NAME" | "MEMO";

export const searchFieldOptions = [
  { value: "all", label: "전체" },
  { value: "TASK_ID", label: "태스크ID" },
  { value: "TASK_NAME", label: "태스크명" },
  { value: "MEMO", label: "메모" },
] as const;
