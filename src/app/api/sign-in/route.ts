import { NextResponse } from "next/server";
import type { SignInRequest } from "@/shared/api/contracts";
import {
  getAuthTokens,
  getInvalidCredentialsError,
  isValidSignIn,
  REFRESH_TOKEN,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/api/mock-backend";

export async function POST(request: Request) {
  const payload = (await request.json()) as SignInRequest;

  if (!isValidSignIn(payload)) {
    return NextResponse.json(getInvalidCredentialsError(), {
      status: 400,
    });
  }

  const response = NextResponse.json(getAuthTokens());

  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN, {
    path: "/",
    sameSite: "lax",
  });

  return response;
}
