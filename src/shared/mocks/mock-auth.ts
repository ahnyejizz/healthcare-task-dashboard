// shared
import type { AuthTokenResponse, SignInRequest } from "@/shared/api/api-types";
import { mockCredentials } from "@/shared/mocks/data/seed";

export const REFRESH_TOKEN_COOKIE_NAME = "token";
const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 60 * 30;
const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;
const TOKEN_HEADER = {
  alg: "HS256",
  typ: "JWT",
} as const;
const ACCESS_TOKEN_SIGNATURE = "mock-access-signature";
const REFRESH_TOKEN_SIGNATURE = "mock-refresh-signature";

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

  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
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
function createAccessToken(id: string) {
  return createToken(id, ACCESS_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN_SECONDS);
}

/**
 * @page  - [공통 Mock]
 * @title - 리프레시 토큰 생성 함수
 * @desc  - 리프레시 토큰용 서명과 만료 시간을 적용해 mock JWT 생성
 */
function createRefreshToken(id: string) {
  return createToken(id, REFRESH_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN_SECONDS);
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
  return payload.email === mockCredentials.email && payload.password === mockCredentials.password;
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
