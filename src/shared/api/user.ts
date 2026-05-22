import type { SessionResponse, UserResponse } from "@/shared/api/contracts";
import { apiRequest } from "@/shared/api/http";

/**
 * @page  - [공통 API]
 * @title - 회원정보 조회 함수
 * @desc  - 회원정보 API 요청을 전송
 */
export function getUser() {
  return apiRequest<UserResponse>("/user");
}

/**
 * @page  - [공통 API]
 * @title - 세션 조회 함수
 * @desc  - 로그인 세션 API 요청을 전송
 */
export function getSession() {
  return apiRequest<SessionResponse>("/session");
}
