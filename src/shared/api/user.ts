import type { UserResponse } from "@/shared/api/contracts";
import { apiRequest } from "@/shared/api/http";

export function getUser() {
  return apiRequest<UserResponse>("/user");
}
