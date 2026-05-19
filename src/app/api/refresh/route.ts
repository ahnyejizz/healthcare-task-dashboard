import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  getAuthTokens,
  getInvalidRefreshTokenError,
  getRefreshTokenEmail,
  hasValidRefreshTokenCookie,
} from "@/shared/api/mock-backend";

export async function POST(request: Request) {
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

  return response;
}
