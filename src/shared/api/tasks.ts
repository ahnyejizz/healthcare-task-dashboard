import type { DeleteTaskResponse } from "@/shared/api/contracts";
import { apiRequest } from "@/shared/api/http";

export function deleteTask(id: string) {
  return apiRequest<DeleteTaskResponse>(`/task/${id}`, {
    method: "DELETE",
  });
}
