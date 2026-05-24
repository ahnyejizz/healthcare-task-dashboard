import { NextResponse } from "next/server";
import {
  getAuthorizedEmail,
  getUnauthorizedError,
  getUser,
  isAuthorizedRequest,
} from "@/shared/mocks/mock-backend";

/**
 * @page  - [회원정보]
 * @title - 회원정보 Route Handler
 * @desc  - 인증 확인 후 현재 로그인 사용자의 프로필 정보 반환
 */
export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(getUnauthorizedError(), {
      status: 401,
    });
  }

  const email = getAuthorizedEmail(request);

  if (!email) {
    return NextResponse.json(getUnauthorizedError(), {
      status: 401,
    });
  }

  return NextResponse.json(getUser(email));
}
