import { NextResponse } from "next/server";
import {
  getAuthorizedEmail,
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

  const email = getAuthorizedEmail(request);

  if (!email) {
    return NextResponse.json(getUnauthorizedError(), {
      status: 401,
    });
  }

  return NextResponse.json(getUser(email));
}
