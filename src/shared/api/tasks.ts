// shared
import type {
  DeleteTaskResponse,
  TaskDetailResponse,
  TaskListResponse,
} from "@/shared/api/contracts";
import { apiRequest } from "@/shared/api/http";

/**
 * @page  - [공통 API]
 * @title - 할 일 목록 조회 함수
 * @desc  - 페이지 번호 기준으로 할 일 목록 API 요청을 전송
 */
export function getTaskPage(page: number) {
  return apiRequest<TaskListResponse>(`/task?page=${page}`);
}

/**
 * @page  - [공통 API]
 * @title - 할 일 상세 조회 함수
 * @desc  - 할 일 ID 기준으로 상세 API 요청을 전송
 */
export function getTaskDetail(id: string) {
  return apiRequest<TaskDetailResponse>(`/task/${id}`);
}

/**
 * @page  - [공통 API]
 * @title - 할 일 삭제 요청 함수
 * @desc  - 할 일 ID 기준으로 삭제 API 요청을 전송
 */
export function deleteTask(id: string) {
  return apiRequest<DeleteTaskResponse>(`/task/${id}`, {
    method: "DELETE",
  });
}
