import { NextResponse } from "next/server";
import { getTaskPage, getUnauthorizedError, isAuthorizedRequest } from "@/shared/mocks/mock-backend";

/**
 * @page  - [할 일 목록]
 * @title - 할 일 목록 Route Handler
 * @desc  - 인증 확인 후 page 파라미터 기반 페이지네이션된 할 일 목록 반환
 */
export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(getUnauthorizedError(), {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");

  return NextResponse.json(getTaskPage(page));
}
