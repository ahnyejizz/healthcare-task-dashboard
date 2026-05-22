import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/shared/api/mock-backend";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", {
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}
