// shared
import type { DashboardResponse } from "@/shared/api/contracts";
import { apiRequest } from "@/shared/api/core/http";

/**
 * @page  - [대시보드]
 * @title - 대시보드 조회 함수
 * @desc  - 대시보드 지표 API 요청을 전송
 */
export function getDashboard() {
  return apiRequest<DashboardResponse>("/dashboard");
}
