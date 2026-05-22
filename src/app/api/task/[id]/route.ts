import { NextResponse } from "next/server";
import {
  deleteTaskById,
  getDeleteTaskNotFoundError,
  getTaskDetail,
  getTaskNotFoundError,
  getUnauthorizedError,
  isAuthorizedRequest,
} from "@/shared/api/mock-backend";

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
