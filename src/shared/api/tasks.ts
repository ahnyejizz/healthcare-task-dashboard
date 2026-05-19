import type {
  DeleteTaskResponse,
  TaskDetailResponse,
  TaskListResponse,
} from "@/shared/api/contracts";
import { apiRequest } from "@/shared/api/http";

export function getTaskPage(page: number) {
  return apiRequest<TaskListResponse>(`/task?page=${page}`);
}

export function getTaskDetail(id: string) {
  return apiRequest<TaskDetailResponse>(`/task/${id}`);
}

export function deleteTask(id: string) {
  return apiRequest<DeleteTaskResponse>(`/task/${id}`, {
    method: "DELETE",
  });
}
