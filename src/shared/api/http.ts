import type { ErrorResponse } from "@/shared/api/contracts";

type RequestOptions = RequestInit & {
  isPublic?: boolean;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
) {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError(
      "네트워크 요청에 실패했습니다. 개발 환경에서는 MSW 설정을 확인해주세요.",
      0,
    );
  }

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | ErrorResponse
      | null;

    throw new ApiError(
      errorBody?.errorMessage ?? "요청 처리에 실패했습니다.",
      response.status,
    );
  }

  return (await response.json()) as T;
}
