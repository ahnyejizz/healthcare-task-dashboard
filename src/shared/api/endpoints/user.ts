// shared
import type { SessionResponse, UserResponse } from "@/shared/api/api-types";
import { apiRequest } from "@/shared/api/core/http";

/**
 * @page  - [회원정보]
 * @title - 회원정보 조회 함수
 * @desc  - 회원정보 API 요청을 전송
 */
export function getUser() {
  return apiRequest<UserResponse>("/user");
}

/**
 * @page  - [회원정보]
 * @title - 세션 조회 함수
 * @desc  - 로그인 세션 API 요청을 전송
 */
export function getSession() {
  return apiRequest<SessionResponse>("/session");
}
