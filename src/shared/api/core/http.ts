// shared
import type { AuthTokenResponse, ErrorResponse } from "@/shared/api/api-types";
import { getAccessToken, markSignedIn, markSignedOut } from "@/shared/api/core/auth-storage";

type RequestOptions = RequestInit & {
  isPublic?: boolean;
  _retriedAfterRefresh?: boolean;
};

/**
 * @page  - [공통]
 * @title - API 에러 클래스
 * @desc  - 상태 코드를 포함한 공통 API 에러 객체 제공
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * @page  - [공통]
 * @title - API 요청 전송 함수
 * @desc  - 공통 헤더와 인증 토큰을 포함해 실제 fetch 요청을 전송
 */
async function sendRequest(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  const accessToken = getAccessToken();

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!options.isPublic && accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError("네트워크 요청에 실패했습니다. 개발 환경에서는 MSW 설정을 확인해주세요.", 0);
  }

  return response;
}

/**
 * @page  - [공통]
 * @title - 액세스 토큰 재발급 함수
 * @desc  - 리프레시 토큰 기반으로 액세스 토큰을 재발급하고 인증 상태를 갱신
 */
async function refreshAccessToken() {
  const response = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ErrorResponse | null;

    markSignedOut();

    throw new ApiError(errorBody?.errorMessage ?? "인증 갱신에 실패했습니다.", response.status);
  }

  const tokens = (await response.json()) as AuthTokenResponse;
  markSignedIn(tokens);
}

/**
 * @page  - [공통]
 * @title - API 요청 함수
 * @desc  - 인증 갱신을 포함한 공통 API 요청 처리
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  let response = await sendRequest(path, options);

  if (
    response.status === 401 &&
    !options.isPublic &&
    !options._retriedAfterRefresh &&
    path !== "/refresh"
  ) {
    await refreshAccessToken();
    response = await sendRequest(path, {
      ...options,
      _retriedAfterRefresh: true,
    });
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ErrorResponse | null;

    throw new ApiError(errorBody?.errorMessage ?? "요청 처리에 실패했습니다.", response.status);
  }

  return (await response.json()) as T;
}
