import { NextResponse } from "next/server";
import {
  getAuthTokens,
  getInvalidRefreshTokenError,
  getRefreshTokenEmail,
  hasValidRefreshTokenCookie,
} from "@/shared/api/mock-backend";

export async function POST(request: Request) {
  if (!hasValidRefreshTokenCookie(request)) {
    return NextResponse.json(getInvalidRefreshTokenError(), {
      status: 401,
    });
  }

  const email = getRefreshTokenEmail(request);

  if (!email) {
    return NextResponse.json(getInvalidRefreshTokenError(), {
      status: 401,
    });
  }

  return NextResponse.json(getAuthTokens(email));
}
