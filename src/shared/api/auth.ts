import type { AuthTokenResponse, SignInRequest, SuccessResponse } from "@/shared/api/contracts";
import { apiRequest } from "@/shared/api/http";

export function signIn(payload: SignInRequest) {
  return apiRequest<AuthTokenResponse>("/sign-in", {
    method: "POST",
    body: JSON.stringify(payload),
    isPublic: true,
  });
}

export function signOut() {
  return apiRequest<SuccessResponse>("/sign-out", {
    method: "POST",
    isPublic: true,
  });
}
