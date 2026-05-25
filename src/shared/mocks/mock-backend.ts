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

/**
 * @page  - [공통 Mock]
 * @title - Base64 URL 인코딩 함수
 * @desc  - JWT 헤더와 payload 생성을 위해 문자열을 Base64 URL 형식으로 인코딩
 */
function encodeBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }

  return btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/**
 * @page  - [공통 Mock]
 * @title - Base64 URL 디코딩 함수
 * @desc  - JWT 형식 문자열의 헤더와 payload를 원본 문자열로 복원
 */
function decodeBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64url").toString("utf8");
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

/**
 * @page  - [공통 Mock]
 * @title - JWT 생성 함수
 * @desc  - id와 만료 시각을 포함한 mock JWT 문자열 생성
 */
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

/**
 * @page  - [공통 Mock]
 * @title - JWT 파싱 함수
 * @desc  - 서명과 만료 시각을 검증한 뒤 mock JWT payload를 반환
 */
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

/**
 * @page  - [공통 Mock]
 * @title - 액세스 토큰 생성 함수
 * @desc  - 액세스 토큰용 서명과 만료 시간을 적용해 mock JWT 생성
 */
function createAccessToken(email: string) {
  return createToken(email, ACCESS_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN_SECONDS);
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 생성 함수
 * @desc  - 리프레시 토큰용 서명과 만료 시간을 적용해 mock JWT 생성
 */
function createRefreshToken(email: string) {
  return createToken(email, REFRESH_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN_SECONDS);
}

/**
 * @page  - [공통 Mock]
 * @title - 액세스 토큰 파싱 함수
 * @desc  - 액세스 토큰 서명과 만료 시각을 검증한 뒤 payload 반환
 */
function parseAccessToken(accessToken: string | null) {
  return parseToken(accessToken, ACCESS_TOKEN_SIGNATURE);
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 파싱 함수
 * @desc  - 리프레시 토큰 서명과 만료 시각을 검증한 뒤 payload 반환
 */
function parseRefreshToken(refreshToken: string | null) {
  return parseToken(refreshToken, REFRESH_TOKEN_SIGNATURE);
}

/**
 * @page  - [공통 Mock]
 * @title - 쿠키 값 조회 함수
 * @desc  - 요청 헤더에서 지정한 이름의 쿠키 값을 추출
 */
function getCookieValue(request: Request, cookieName: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${cookieName}=`))
    ?.slice(`${cookieName}=`.length);
}

/**
 * @page  - [공통 Mock]
 * @title - Bearer 토큰 조회 함수
 * @desc  - Authorization 헤더에서 Bearer 토큰 문자열을 추출
 */
function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length) || null;
}

/**
 * @page  - [공통 Mock]
 * @title - 인증 사용자 식별 함수
 * @desc  - 액세스 토큰을 파싱해 현재 인증된 사용자 id를 반환
 */
export function getAuthorizedEmail(request: Request) {
  return parseAccessToken(getBearerToken(request))?.id ?? null;
}

/**
 * @page  - [공통 Mock]
 * @title - 인증 여부 확인 함수
 * @desc  - 요청에 유효한 Bearer 액세스 토큰이 포함되어 있는지 확인
 */
export function isAuthorizedRequest(request: Request) {
  return Boolean(getAuthorizedEmail(request));
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 사용자 식별 함수
 * @desc  - 리프레시 토큰 쿠키를 파싱해 현재 사용자 id를 반환
 */
export function getRefreshTokenEmail(request: Request) {
  return parseRefreshToken(getCookieValue(request, REFRESH_TOKEN_COOKIE_NAME) ?? null)?.id ?? null;
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 쿠키 존재 확인 함수
 * @desc  - 요청에 리프레시 토큰 쿠키가 포함되어 있는지 확인
 */
export function hasRefreshTokenCookie(request: Request) {
  return Boolean(getCookieValue(request, REFRESH_TOKEN_COOKIE_NAME));
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 쿠키 유효성 확인 함수
 * @desc  - 리프레시 토큰 쿠키가 존재하고 파싱 가능한지 확인
 */
export function hasValidRefreshTokenCookie(request: Request) {
  return Boolean(getRefreshTokenEmail(request));
}

/**
 * @page  - [공통 Mock]
 * @title - 로그인 자격증명 검증 함수
 * @desc  - mock 기준 계정과 입력된 이메일 및 비밀번호가 일치하는지 확인
 */
export function isValidSignIn(payload: SignInRequest) {
  return (
    payload.email === mockCredentials.email &&
    payload.password === mockCredentials.password
  );
}

/**
 * @page  - [공통 Mock]
 * @title - 인증 토큰 발급 함수
 * @desc  - 액세스 토큰과 리프레시 토큰을 함께 생성해 반환
 */
export function getAuthTokens(email: string): AuthTokenResponse {
  return {
    accessToken: createAccessToken(email),
    refreshToken: createRefreshToken(email),
  };
}

/**
 * @page  - [공통 Mock]
 * @title - 인증 필요 에러 응답 함수
 * @desc  - 로그인 필요 상황에서 사용할 에러 응답 객체를 반환
 */
export function getUnauthorizedError(): ErrorResponse {
  return {
    errorMessage: "로그인이 필요합니다.",
  };
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 무효 에러 응답 함수
 * @desc  - 유효하지 않은 리프레시 토큰 상황의 에러 응답 객체를 반환
 */
export function getInvalidRefreshTokenError(): ErrorResponse {
  return {
    errorMessage: "리프레시 토큰이 유효하지 않습니다.",
  };
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 누락 에러 응답 함수
 * @desc  - 리프레시 토큰 쿠키가 없는 상황의 에러 응답 객체를 반환
 */
export function getMissingRefreshTokenError(): ErrorResponse {
  return {
    errorMessage: "리프레시 토큰이 없습니다.",
  };
}

/**
 * @page  - [로그인]
 * @title - 로그인 실패 에러 응답 함수
 * @desc  - 잘못된 로그인 자격증명 상황의 에러 응답 객체를 반환
 */
export function getInvalidCredentialsError(): ErrorResponse {
  return {
    errorMessage: "이메일 또는 비밀번호를 다시 확인해주세요.",
  };
}

/**
 * @page  - [할 일 목록]
 * @title - 잘못된 페이지 파라미터 에러 응답 함수
 * @desc  - page 쿼리 파라미터가 명세와 맞지 않는 상황의 에러 응답 객체를 반환
 */
export function getInvalidTaskPageError(): ErrorResponse {
  return {
    errorMessage: "page 파라미터는 1 이상의 정수여야 합니다.",
  };
}

/**
 * @page  - [회원정보]
 * @title - 세션 응답 생성 함수
 * @desc  - 현재 로그인 사용자의 세션 응답 객체를 생성
 */
export function getSession(email: string): SessionResponse {
  return {
    email,
  };
}

/**
 * @page  - [회원정보]
 * @title - 회원정보 응답 생성 함수
 * @desc  - 사용자 fixture를 기반으로 회원정보 응답 객체를 반환
 */
export function getUser(email: string): UserResponse {
  return (
    userFixtureByEmail[email] ?? {
      name: "-",
      memo: `${email} 계정의 회원정보가 아직 준비되지 않았습니다.`,
    }
  );
}

/**
 * @page  - [대시보드]
 * @title - 대시보드 지표 생성 함수
 * @desc  - 전체/남은 일/완료한 일 개수를 계산해 대시보드 응답 객체를 반환
 */
export function getDashboard(): DashboardResponse {
  return {
    numOfTask: taskStore.length,
    numOfRestTask: taskStore.filter((task) => task.status === "TODO").length,
    numOfDoneTask: taskStore.filter((task) => task.status === "DONE").length,
  };
}

/**
 * @page  - [할 일 목록]
 * @title - 할 일 목록 응답 생성 함수
 * @desc  - page 기준으로 taskStore를 잘라 페이지네이션된 목록 응답 객체를 반환
 */
export function getTaskPage(page: number): TaskListResponse {
  const start = (page - 1) * PAGE_SIZE;
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

/**
 * @page  - [할 일 상세]
 * @title - 할 일 상세 응답 생성 함수
 * @desc  - id에 해당하는 할 일 상세 정보를 찾아 응답 객체를 반환
 */
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

/**
 * @page  - [할 일 상세]
 * @title - 할 일 삭제 처리 함수
 * @desc  - id에 해당하는 할 일을 taskStore에서 제거하고 성공 응답을 반환
 */
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

/**
 * @page  - [할 일 상세]
 * @title - 할 일 미존재 에러 응답 함수
 * @desc  - 상세 조회 대상이 없는 경우 사용할 에러 응답 객체를 반환
 */
export function getTaskNotFoundError(): ErrorResponse {
  return {
    errorMessage: "해당 할 일을 찾을 수 없습니다.",
  };
}

/**
 * @page  - [할 일 상세]
 * @title - 할 일 삭제 불가 에러 응답 함수
 * @desc  - 이미 삭제되었거나 존재하지 않는 할 일 삭제 시도의 에러 응답 객체를 반환
 */
export function getDeleteTaskNotFoundError(): ErrorResponse {
  return {
    errorMessage: "이미 삭제되었거나 존재하지 않는 할 일입니다.",
  };
}
