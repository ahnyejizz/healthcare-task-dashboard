import type { AuthTokenResponse } from "@/shared/api/contracts";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/api/mock-backend";

const AUTH_STATE_CHANGE_EVENT = "healthcare-task-dashboard-auth-state-change";
const AUTH_REDIRECT_EVENT = "healthcare-task-dashboard-auth-redirect-change";

let isAuthRedirecting = false;
let authState: boolean | null = null;

function notifyAuthStateChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
}

function notifyAuthRedirectChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_REDIRECT_EVENT));
}

function readCookie(cookieName: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${cookieName}=`));

  if (!cookie) {
    return null;
  }

  return cookie.slice(`${cookieName}=`.length) || null;
}

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

export function hasAccessTokenCookie() {
  return Boolean(readCookie(ACCESS_TOKEN_COOKIE_NAME));
}

export function getIsAuthenticated() {
  return authState ?? hasAccessTokenCookie();
}

export function syncAuthCookies(tokens: AuthTokenResponse) {
  writeCookie(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken);
  writeCookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken);
}

export function clearAuthCookies() {
  writeCookie(ACCESS_TOKEN_COOKIE_NAME, "", 0);
  writeCookie(REFRESH_TOKEN_COOKIE_NAME, "", 0);
}

export function markSignedIn(tokens?: AuthTokenResponse) {
  if (tokens) {
    syncAuthCookies(tokens);
  }

  authState = true;
  notifyAuthStateChange();
}

export function markSignedOut() {
  clearAuthCookies();
  authState = false;
  notifyAuthStateChange();
}

export function getIsAuthRedirecting() {
  return isAuthRedirecting;
}

export function startAuthRedirect() {
  isAuthRedirecting = true;
  notifyAuthRedirectChange();
}

export function finishAuthRedirect() {
  isAuthRedirecting = false;
  notifyAuthRedirectChange();
}

export function subscribeToAuthStateChange(onChange: (value: boolean) => void) {
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

export function subscribeToAuthRedirectChange(onChange: (value: boolean) => void) {
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

export function subscribeAuthState(onStoreChange: () => void) {
  return subscribeToAuthStateChange(() => {
    onStoreChange();
  });
}

export function subscribeAuthRedirectState(onStoreChange: () => void) {
  return subscribeToAuthRedirectChange(() => {
    onStoreChange();
  });
}

export function getAuthStateSnapshot() {
  return getIsAuthenticated();
}

export function getAuthRedirectSnapshot() {
  return getIsAuthRedirecting();
}

export function getAuthStateServerSnapshot() {
  return false;
}

export function getAuthRedirectServerSnapshot() {
  return false;
}
