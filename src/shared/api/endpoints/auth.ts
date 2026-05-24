// shared
import type { AuthTokenResponse, SignInRequest, SuccessResponse } from "@/shared/api/contracts";
import { apiRequest } from "@/shared/api/core/http";

/**
 * @page  - [로그인]
 * @title - 로그인 요청 함수
 * @desc  - 로그인 API 요청을 전송
 */
export function signIn(payload: SignInRequest) {
  return apiRequest<AuthTokenResponse>("/sign-in", {
    method: "POST",
    body: JSON.stringify(payload),
    isPublic: true,
  });
}

/**
 * @page  - [회원정보]
 * @title - 로그아웃 요청 함수
 * @desc  - 로그아웃 API 요청을 전송
 */
export function signOut() {
  return apiRequest<SuccessResponse>("/sign-out", {
    method: "POST",
    isPublic: true,
  });
}
