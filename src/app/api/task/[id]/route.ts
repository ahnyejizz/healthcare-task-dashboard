import { NextResponse } from "next/server";
import {
  deleteTaskById,
  getDeleteTaskNotFoundError,
  getTaskDetail,
  getTaskNotFoundError,
  getUnauthorizedError,
  isAuthorizedRequest,
} from "@/shared/api/mock-backend";

/**
 * @page  - [할 일 상세]
 * @title - 할 일 상세 조회 Route Handler
 * @desc  - 인증 확인 후 id에 해당하는 할 일 상세 정보 반환, 존재하지 않으면 404 응답
 */
export async function GET(request: Request, ctx: RouteContext<"/api/task/[id]">) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(getUnauthorizedError(), {
      status: 401,
    });
  }

  const { id } = await ctx.params;
  const task = getTaskDetail(id);

  if (!task) {
    return NextResponse.json(getTaskNotFoundError(), {
      status: 404,
    });
  }

  return NextResponse.json(task);
}

/**
 * @page  - [할 일 상세]
 * @title - 할 일 삭제 Route Handler
 * @desc  - 인증 확인 후 id에 해당하는 할 일 삭제, 존재하지 않으면 404 응답
 */
export async function DELETE(request: Request, ctx: RouteContext<"/api/task/[id]">) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(getUnauthorizedError(), {
      status: 401,
    });
  }

  const { id } = await ctx.params;
  const result = deleteTaskById(id);

  if (!result) {
    return NextResponse.json(getDeleteTaskNotFoundError(), {
      status: 404,
    });
  }

  return NextResponse.json(result);
}
