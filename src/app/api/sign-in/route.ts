import { NextResponse } from "next/server";
import type { SignInRequest } from "@/shared/api/contracts";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  getAuthTokens,
  getInvalidCredentialsError,
  isValidSignIn,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/api/mock-backend";

/**
 * @page  - [로그인]
 * @title - 로그인 Route Handler
 * @desc  - 자격증명 검증 후 액세스/리프레시 토큰 발급 및 쿠키 설정
 */
export async function POST(request: Request) {
  const payload = (await request.json()) as SignInRequest;

  if (!isValidSignIn(payload)) {
    return NextResponse.json(getInvalidCredentialsError(), {
      status: 400,
    });
  }

  const tokens = getAuthTokens(payload.email);
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
