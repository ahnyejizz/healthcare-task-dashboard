import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/shared/mocks/mock-backend";

/**
 * @page  - [로그인]
 * @title - 로그아웃 Route Handler
 * @desc  - 액세스/리프레시 토큰 쿠키를 만료 처리하여 세션 종료
 */
export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", {
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}
