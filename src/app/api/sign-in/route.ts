import { NextResponse } from "next/server";

// shared
import {
  getAuthTokens,
  getInvalidCredentialsError,
  isValidSignIn,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/mocks/mock-backend";

// features
import { signInSchema } from "@/features/auth/sign-in/model/sign-in-schema";

/**
 * @page  - [로그인]
 * @title - 로그인 Route Handler
 * @desc  - 자격증명 검증 후 액세스/리프레시 토큰 발급 및 쿠키 설정
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errorMessage: parsed.error.issues[0]?.message ?? "요청 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const payload = parsed.data;

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
  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
    path: "/",
    sameSite: "lax",
  });

  return response;
}
