import { NextResponse } from "next/server";
import {
  getUnauthorizedError,
  getUser,
  isAuthorizedRequest,
} from "@/shared/api/mock-backend";

export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(getUnauthorizedError(), {
      status: 401,
    });
  }

  return NextResponse.json(getUser());
}
