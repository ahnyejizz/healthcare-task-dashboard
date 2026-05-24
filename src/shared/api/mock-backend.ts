// shared
import type {
  AuthTokenResponse,
  DashboardResponse,
  DeleteTaskResponse,
  ErrorResponse,
  SessionResponse,
  SignInRequest,
  TaskDetailResponse,
  TaskListResponse,
  UserResponse,
} from "@/shared/api/contracts";
import { mockCredentials, tasksFixture, userFixtureByEmail } from "@/shared/mocks/data/seed";

const ACCESS_TOKEN_PREFIX = "mock-access-token";
const REFRESH_TOKEN_PREFIX = "mock-refresh-token";
export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const REFRESH_TOKEN_COOKIE_NAME = "token";

const PAGE_SIZE = 10;
const taskStore = tasksFixture.map((task, index) => ({
  ...task,
  registerDatetime: new Date(
    Date.UTC(2026, 4, (index % 28) + 1, 9 + (index % 5), 10),
  ).toISOString(),
}));

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

function getCookieValue(request: Request, cookieName: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${cookieName}=`))
    ?.slice(`${cookieName}=`.length);
}

export function getAuthorizedEmail(request: Request) {
  return parseAccessToken(getCookieValue(request, ACCESS_TOKEN_COOKIE_NAME) ?? null);
}

export function isAuthorizedRequest(request: Request) {
  return Boolean(getAuthorizedEmail(request));
}

export function getRefreshTokenEmail(request: Request) {
  return parseRefreshToken(getCookieValue(request, REFRESH_TOKEN_COOKIE_NAME) ?? null);
}

export function hasRefreshTokenCookie(request: Request) {
  return Boolean(getCookieValue(request, REFRESH_TOKEN_COOKIE_NAME));
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

export function getMissingRefreshTokenError(): ErrorResponse {
  return {
    errorMessage: "리프레시 토큰이 없습니다.",
  };
}

export function getInvalidCredentialsError(): ErrorResponse {
  return {
    errorMessage: "이메일 또는 비밀번호를 다시 확인해주세요.",
  };
}

export function getSession(email: string): SessionResponse {
  return {
    email,
  };
}

export function getUser(email: string): UserResponse {
  return (
    userFixtureByEmail[email] ?? {
      name: "-",
      memo: `${email} 계정의 회원정보가 아직 준비되지 않았습니다.`,
    }
  );
}

export function getDashboard(): DashboardResponse {
  return {
    numOfTask: taskStore.length,
    numOfRestTask: taskStore.filter((task) => task.status === "TODO").length,
    numOfDoneTask: taskStore.filter((task) => task.status === "DONE").length,
  };
}

export function getTaskPage(page: number): TaskListResponse {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return {
    data: taskStore.slice(start, end).map((task) => ({
      id: task.id,
      title: task.title,
      memo: task.memo,
      status: task.status,
    })),
    hasNext: end < taskStore.length,
  };
}

export function getTaskDetail(id: string): TaskDetailResponse | null {
  const task = taskStore.find((item) => item.id === id);

  if (!task) {
    return null;
  }

  return {
    title: task.title,
    memo: task.memo,
    registerDatetime: task.registerDatetime,
  };
}

export function deleteTaskById(id: string): DeleteTaskResponse | null {
  const taskIndex = taskStore.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return null;
  }

  taskStore.splice(taskIndex, 1);

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
