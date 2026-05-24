import { NextResponse } from "next/server";
import { getDashboard, getUnauthorizedError, isAuthorizedRequest } from "@/shared/mocks/mock-backend";

/**
 * @page  - [대시보드]
 * @title - 대시보드 Route Handler
 * @desc  - 인증 확인 후 대시보드 지표 데이터 반환
 */
export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(getUnauthorizedError(), {
      status: 401,
    });
  }

  return NextResponse.json(getDashboard());
}
