import { NextResponse } from "next/server";

// shared
import type { SignInRequest } from "@/shared/api/api-types";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  getAuthTokens,
  getInvalidCredentialsError,
  isValidSignIn,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/mocks/mock-backend";

/**
 * @page  - [로그인]
 * @title - 로그인 Route Handler
 * @desc  - 자격증명 검증 후 액세스/리프레시 토큰 발급 및 쿠키 설정
 */
export async function POST(request: Request) {
  const payload = (await request.json()) as SignInRequest;

  if (!isValidSignIn(payload)) {
    // 이메일/비밀번호가 mock 기준 계정과 맞지 않으면
    return NextResponse.json(getInvalidCredentialsError(), {
      status: 400,
    });
  }

  // 토큰 생성
  const tokens = getAuthTokens(payload.email);

  // 응답 본문 생성
  const response = NextResponse.json(tokens);

  // 쿠키 설정
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
