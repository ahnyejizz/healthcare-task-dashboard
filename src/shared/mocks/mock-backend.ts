/**
 * @page  - [공통 Mock]
 * @title - Mock 백엔드 모듈
 * @desc  - API 타입과 fixture를 조합해 MSW 및 Route Handler에서 공통으로 사용하는 mock 서버 동작을 재현
 */

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
} from "@/shared/api/api-types";
import { mockCredentials, tasksFixture, userFixtureByEmail } from "@/shared/mocks/data/seed";

export const REFRESH_TOKEN_COOKIE_NAME = "token";
const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 60 * 30;
const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;
const TOKEN_HEADER = {
  alg: "HS256",
  typ: "JWT",
} as const;
const ACCESS_TOKEN_SIGNATURE = "mock-access-signature";
const REFRESH_TOKEN_SIGNATURE = "mock-refresh-signature";

const PAGE_SIZE = 10;
const taskStore = tasksFixture.map((task, index) => ({
  ...task,
  registerDatetime: new Date(
    Date.UTC(2026, 4, (index % 28) + 1, 9 + (index % 5), 10),
  ).toISOString(),
}));

type TokenPayload = {
  exp: number;
  id: string;
};

function encodeBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }

  return btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64url").toString("utf8");
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

function createToken(id: string, signature: string, expiresInSeconds: number) {
  const payload: TokenPayload = {
    id,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  return [
    encodeBase64Url(JSON.stringify(TOKEN_HEADER)),
    encodeBase64Url(JSON.stringify(payload)),
    signature,
  ].join(".");
}

function parseToken(token: string | null, expectedSignature: string) {
  if (!token) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !signature || signature !== expectedSignature) {
    return null;
  }

  try {
    const header = JSON.parse(decodeBase64Url(encodedHeader)) as typeof TOKEN_HEADER;
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as TokenPayload;

    if (header.typ !== "JWT" || typeof payload.id !== "string" || typeof payload.exp !== "number") {
      return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function createAccessToken(email: string) {
  return createToken(email, ACCESS_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN_SECONDS);
}

function createRefreshToken(email: string) {
  return createToken(email, REFRESH_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN_SECONDS);
}

function parseAccessToken(accessToken: string | null) {
  return parseToken(accessToken, ACCESS_TOKEN_SIGNATURE);
}

function parseRefreshToken(refreshToken: string | null) {
  return parseToken(refreshToken, REFRESH_TOKEN_SIGNATURE);
}

function getCookieValue(request: Request, cookieName: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${cookieName}=`))
    ?.slice(`${cookieName}=`.length);
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length) || null;
}

export function getAuthorizedEmail(request: Request) {
  return parseAccessToken(getBearerToken(request))?.id ?? null;
}

export function isAuthorizedRequest(request: Request) {
  return Boolean(getAuthorizedEmail(request));
}

export function getRefreshTokenEmail(request: Request) {
  return parseRefreshToken(getCookieValue(request, REFRESH_TOKEN_COOKIE_NAME) ?? null)?.id ?? null;
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
