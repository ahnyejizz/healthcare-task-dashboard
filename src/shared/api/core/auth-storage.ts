// shared
import type { AuthTokenResponse } from "@/shared/api/api-types";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/shared/mocks/mock-backend";

const AUTH_STATE_CHANGE_EVENT = "healthcare-task-dashboard-auth-state-change";
const AUTH_REDIRECT_EVENT = "healthcare-task-dashboard-auth-redirect-change";
const ACCESS_TOKEN_STORAGE_KEY = "healthcare-task-dashboard-access-token";

let isAuthRedirecting = false;
let authState: boolean | null = null;

/**
 * @page  - [공통]
 * @title - 인증 상태 변경 알림 함수
 * @desc  - 인증 상태 변경 이벤트를 window에 전파
 */
function notifyAuthStateChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
}

/**
 * @page  - [공통]
 * @title - 인증 리다이렉트 상태 변경 알림 함수
 * @desc  - 인증 리다이렉트 상태 변경 이벤트를 window에 전파
 */
function notifyAuthRedirectChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_REDIRECT_EVENT));
}

/**
 * @page  - [공통]
 * @title - 쿠키 저장 함수
 * @desc  - 인증 관련 쿠키를 저장하거나 만료 처리
 */
function writeCookie(cookieName: string, value: string, maxAge?: number) {
  if (typeof document === "undefined") {
    return;
  }

  const attributes = ["Path=/", "SameSite=Lax"];

  if (typeof maxAge === "number") {
    attributes.push(`Max-Age=${maxAge}`);
  }

  document.cookie = `${cookieName}=${value}; ${attributes.join("; ")}`;
}

/**
 * @page  - [공통]
 * @title - 액세스 토큰 조회 함수
 * @desc  - localStorage에서 현재 액세스 토큰 값을 조회
 */
function readAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

/**
 * @page  - [공통]
 * @title - 액세스 토큰 저장 함수
 * @desc  - localStorage에 액세스 토큰 값을 저장
 */
function writeAccessToken(accessToken: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

/**
 * @page  - [공통]
 * @title - 액세스 토큰 삭제 함수
 * @desc  - localStorage에 저장된 액세스 토큰 값을 제거
 */
function clearAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

/**
 * @page  - [공통]
 * @title - 액세스 토큰 존재 여부 확인 함수
 * @desc  - 현재 액세스 토큰이 저장되어 있는지 boolean 값으로 반환
 */
function hasAccessToken() {
  return Boolean(readAccessToken());
}

/**
 * @page  - [공통]
 * @title - 액세스 토큰 반환 함수
 * @desc  - 현재 저장된 액세스 토큰 문자열을 반환
 */
export function getAccessToken() {
  return readAccessToken();
}

/**
 * @page  - [공통]
 * @title - 인증 상태 조회 함수
 * @desc  - 메모리 상태와 액세스 토큰 존재 여부를 기준으로 현재 인증 여부를 반환
 */
export function getIsAuthenticated() {
  return authState ?? hasAccessToken();
}

/**
 * @page  - [공통]
 * @title - 인증 쿠키 동기화 함수
 * @desc  - 리프레시 토큰을 브라우저 쿠키에 반영
 */
function syncAuthCookies(tokens: AuthTokenResponse) {
  writeCookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken);
}

/**
 * @page  - [공통]
 * @title - 인증 쿠키 삭제 함수
 * @desc  - 리프레시 토큰 쿠키를 만료 처리
 */
function clearAuthCookies() {
  writeCookie(REFRESH_TOKEN_COOKIE_NAME, "", 0);
}

/**
 * @page  - [공통]
 * @title - 로그인 상태 반영 함수
 * @desc  - 액세스 토큰 저장과 리프레시 토큰 쿠키 동기화 후 인증 상태를 로그인 상태로 갱신
 */
export function markSignedIn(tokens?: AuthTokenResponse) {
  if (tokens) {
    writeAccessToken(tokens.accessToken);
    syncAuthCookies(tokens);
  }

  authState = true;
  notifyAuthStateChange();
}

/**
 * @page  - [공통]
 * @title - 로그아웃 상태 반영 함수
 * @desc  - 액세스 토큰과 리프레시 토큰 쿠키를 제거하고 인증 상태를 로그아웃 상태로 갱신
 */
export function markSignedOut() {
  clearAccessToken();
  clearAuthCookies();
  authState = false;
  notifyAuthStateChange();
}

/**
 * @page  - [공통]
 * @title - 인증 리다이렉트 상태 조회 함수
 * @desc  - 현재 인증 리다이렉트 진행 여부를 반환
 */
function getIsAuthRedirecting() {
  return isAuthRedirecting;
}

/**
 * @page  - [공통]
 * @title - 인증 리다이렉트 시작 함수
 * @desc  - 인증 리다이렉트 상태를 시작 상태로 변경하고 이벤트를 전파
 */
export function startAuthRedirect() {
  isAuthRedirecting = true;
  notifyAuthRedirectChange();
}

/**
 * @page  - [공통]
 * @title - 인증 리다이렉트 종료 함수
 * @desc  - 인증 리다이렉트 상태를 종료 상태로 변경하고 이벤트를 전파
 */
export function finishAuthRedirect() {
  isAuthRedirecting = false;
  notifyAuthRedirectChange();
}

/**
 * @page  - [공통]
 * @title - 인증 상태 구독 함수
 * @desc  - 인증 상태 변경 이벤트를 구독하고 해제 함수를 반환
 */
function subscribeToAuthStateChange(onChange: (value: boolean) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => {
    onChange(getIsAuthenticated());
  };

  window.addEventListener(AUTH_STATE_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener(AUTH_STATE_CHANGE_EVENT, handleChange);
  };
}

/**
 * @page  - [공통]
 * @title - 인증 리다이렉트 상태 구독 함수
 * @desc  - 인증 리다이렉트 상태 변경 이벤트를 구독하고 해제 함수를 반환
 */
function subscribeToAuthRedirectChange(onChange: (value: boolean) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => {
    onChange(getIsAuthRedirecting());
  };

  window.addEventListener(AUTH_REDIRECT_EVENT, handleChange);

  return () => {
    window.removeEventListener(AUTH_REDIRECT_EVENT, handleChange);
  };
}

/**
 * @page  - [공통]
 * @title - 인증 상태 외부 저장소 구독 함수
 * @desc  - useSyncExternalStore에서 사용할 인증 상태 구독 함수를 제공
 */
export function subscribeAuthState(onStoreChange: () => void) {
  return subscribeToAuthStateChange(() => {
    onStoreChange();
  });
}

/**
 * @page  - [공통]
 * @title - 인증 리다이렉트 외부 저장소 구독 함수
 * @desc  - useSyncExternalStore에서 사용할 인증 리다이렉트 상태 구독 함수를 제공
 */
export function subscribeAuthRedirectState(onStoreChange: () => void) {
  return subscribeToAuthRedirectChange(() => {
    onStoreChange();
  });
}

/**
 * @page  - [공통]
 * @title - 인증 상태 스냅샷 조회 함수
 * @desc  - useSyncExternalStore에서 사용할 현재 인증 상태 값을 반환
 */
export function getAuthStateSnapshot() {
  return getIsAuthenticated();
}

/**
 * @page  - [공통]
 * @title - 인증 리다이렉트 스냅샷 조회 함수
 * @desc  - useSyncExternalStore에서 사용할 현재 인증 리다이렉트 상태 값을 반환
 */
export function getAuthRedirectSnapshot() {
  return getIsAuthRedirecting();
}

/**
 * @page  - [공통]
 * @title - 서버용 인증 상태 스냅샷 함수
 * @desc  - 서버 렌더링 환경에서 사용할 기본 인증 상태 값을 반환
 */
export function getAuthStateServerSnapshot() {
  return false;
}

/**
 * @page  - [공통]
 * @title - 서버용 인증 리다이렉트 스냅샷 함수
 * @desc  - 서버 렌더링 환경에서 사용할 기본 인증 리다이렉트 상태 값을 반환
 */
export function getAuthRedirectServerSnapshot() {
  return false;
}
