import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  getMissingRefreshTokenError,
  getAuthTokens,
  getInvalidRefreshTokenError,
  getRefreshTokenEmail,
  hasRefreshTokenCookie,
  hasValidRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/api/mock-backend";

/**
 * @page  - [로그인]
 * @title - 토큰 갱신 Route Handler
 * @desc  - 리프레시 토큰 쿠키 검증 후 액세스/리프레시 토큰 재발급
 */
export async function POST(request: Request) {
  if (!hasRefreshTokenCookie(request)) {
    return NextResponse.json(getMissingRefreshTokenError(), {
      status: 400,
    });
  }

  if (!hasValidRefreshTokenCookie(request)) {
    return NextResponse.json(getInvalidRefreshTokenError(), {
      status: 401,
    });
  }

  const email = getRefreshTokenEmail(request);

  if (!email) {
    return NextResponse.json(getInvalidRefreshTokenError(), {
      status: 401,
    });
  }

  const tokens = getAuthTokens(email);
  const response = NextResponse.json(tokens);

  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
    path: "/",
    sameSite: "lax",
  });

  return response;
}
