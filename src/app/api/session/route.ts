import { NextResponse } from "next/server";
import {
  getAuthorizedEmail,
  getSession,
  getUnauthorizedError,
  isAuthorizedRequest,
} from "@/shared/api/mock-backend";

/**
 * @page  - [공통]
 * @title - 세션 조회 Route Handler
 * @desc  - 액세스 토큰 검증 후 현재 로그인 사용자의 세션 정보 반환
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

  return NextResponse.json(getSession(email));
}
