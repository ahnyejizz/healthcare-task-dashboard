import { NextResponse } from "next/server";
import type { SignInRequest } from "@/shared/api/contracts";
import {
  getAuthTokens,
  getInvalidCredentialsError,
  isValidSignIn,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/api/mock-backend";

export async function POST(request: Request) {
  const payload = (await request.json()) as SignInRequest;

  if (!isValidSignIn(payload)) {
    return NextResponse.json(getInvalidCredentialsError(), {
      status: 400,
    });
  }

  const tokens = getAuthTokens(payload.email);
  const response = NextResponse.json(tokens);

  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
    path: "/",
    sameSite: "lax",
  });

  return response;
}
