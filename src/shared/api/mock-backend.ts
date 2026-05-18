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
} from "@/shared/mocks/data/seed";

const ACCESS_TOKEN_PREFIX = "mock-access-token";
const REFRESH_TOKEN_PREFIX = "mock-refresh-token";
export const REFRESH_TOKEN_COOKIE_NAME = "token";

const PAGE_SIZE = 10;

function createAccessToken(email: string) {
  return `${ACCESS_TOKEN_PREFIX}:${email}`;
}

function createRefreshToken(email: string) {
  return `${REFRESH_TOKEN_PREFIX}:${email}`;
}

function parseAccessToken(accessToken: string | null) {
  if (!accessToken?.startsWith(`${ACCESS_TOKEN_PREFIX}:`)) {
    return null;
  }

  return accessToken.slice(`${ACCESS_TOKEN_PREFIX}:`.length) || null;
}

function parseRefreshToken(refreshToken: string | null) {
  if (!refreshToken?.startsWith(`${REFRESH_TOKEN_PREFIX}:`)) {
    return null;
  }

  return refreshToken.slice(`${REFRESH_TOKEN_PREFIX}:`.length) || null;
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length);
}

export function getAuthorizedEmail(request: Request) {
  return parseAccessToken(getBearerToken(request));
}

export function isAuthorizedRequest(request: Request) {
  return Boolean(getAuthorizedEmail(request));
}

export function getRefreshTokenEmail(request: Request) {
  const cookie = request.headers.get("cookie");
  const refreshToken = cookie
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${REFRESH_TOKEN_COOKIE_NAME}=`))
    ?.slice(`${REFRESH_TOKEN_COOKIE_NAME}=`.length);

  return parseRefreshToken(refreshToken ?? null);
}

export function hasValidRefreshTokenCookie(request: Request) {
  return Boolean(getRefreshTokenEmail(request));
}

export function isValidSignIn(payload: SignInRequest) {
  return (
    payload.email === mockCredentials.email &&
    payload.password === mockCredentials.password
  );
}

export function getAuthTokens(email: string): AuthTokenResponse {
  return {
    accessToken: createAccessToken(email),
    refreshToken: createRefreshToken(email),
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

export function getUser(email: string): UserResponse {
  return {
    email,
  };
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
