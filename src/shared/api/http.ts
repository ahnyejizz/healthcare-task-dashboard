// shared
import type { AuthTokenResponse, ErrorResponse } from "@/shared/api/contracts";
import { getAccessToken, markSignedIn, markSignedOut } from "@/shared/api/auth-storage";

type RequestOptions = RequestInit & {
  isPublic?: boolean;
  _retriedAfterRefresh?: boolean;
};

/**
 * @page  - [공통 API]
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
 * @page  - [공통 API]
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
