import { cookies } from "next/headers";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/shared/api/mock-backend";

export async function hasAuthenticatedSession() {
  const cookieStore = await cookies();

  return Boolean(cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value);
}
