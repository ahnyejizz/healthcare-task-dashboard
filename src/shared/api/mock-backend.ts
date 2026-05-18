import type {
  AuthTokenResponse,
  DashboardResponse,
  DeleteTaskResponse,
  ErrorResponse,
  SignInRequest,
  TaskDetailResponse,
  TaskListResponse,
  UserResponse,
} from "@/shared/api/contracts";
import {
  dashboardFixture,
  getTaskDetailFixture,
  mockCredentials,
  tasksFixture,
  userFixture,
} from "@/shared/mocks/data/seed";

export const ACCESS_TOKEN = "mock-access-token";
export const REFRESH_TOKEN = "mock-refresh-token";
export const REFRESH_TOKEN_COOKIE_NAME = "token";

const PAGE_SIZE = 10;

function isAuthorizedHeader(authorization: string | null) {
  return authorization?.startsWith("Bearer ") ?? false;
}

export function isAuthorizedRequest(request: Request) {
  return isAuthorizedHeader(request.headers.get("Authorization"));
}

export function hasValidRefreshTokenCookie(request: Request) {
  const cookie = request.headers.get("cookie");

  return cookie?.includes(`${REFRESH_TOKEN_COOKIE_NAME}=${REFRESH_TOKEN}`) ?? false;
}

export function isValidSignIn(payload: SignInRequest) {
  return (
    payload.email === mockCredentials.email &&
    payload.password === mockCredentials.password
  );
}

export function getAuthTokens(): AuthTokenResponse {
  return {
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN,
  };
}

export function getUnauthorizedError(): ErrorResponse {
  return {
    errorMessage: "로그인이 필요합니다.",
  };
}

export function getInvalidRefreshTokenError(): ErrorResponse {
  return {
    errorMessage: "리프레시 토큰이 유효하지 않습니다.",
  };
}

export function getInvalidCredentialsError(): ErrorResponse {
  return {
    errorMessage: "이메일 또는 비밀번호를 다시 확인해주세요.",
  };
}

export function getUser(): UserResponse {
  return userFixture;
}

export function getDashboard(): DashboardResponse {
  return dashboardFixture;
}

export function getTaskPage(page: number): TaskListResponse {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return {
    data: tasksFixture.slice(start, end),
    hasNext: end < tasksFixture.length,
  };
}

export function getTaskDetail(id: string): TaskDetailResponse | null {
  return getTaskDetailFixture(id);
}

export function deleteTaskById(id: string): DeleteTaskResponse | null {
  const task = getTaskDetailFixture(id);

  if (!task) {
    return null;
  }

  return {
    success: true,
  };
}

export function getTaskNotFoundError(): ErrorResponse {
  return {
    errorMessage: "해당 할 일을 찾을 수 없습니다.",
  };
}

export function getDeleteTaskNotFoundError(): ErrorResponse {
  return {
    errorMessage: "이미 삭제되었거나 존재하지 않는 할 일입니다.",
  };
}
