import { NextResponse } from "next/server";
import {
  getTaskPage,
  getUnauthorizedError,
  isAuthorizedRequest,
} from "@/shared/api/mock-backend";

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
