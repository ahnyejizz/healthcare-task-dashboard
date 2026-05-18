import { delay, http, HttpResponse } from "msw";
import type { SignInRequest } from "@/shared/api/contracts";
import {
  deleteTaskById,
  getAuthTokens,
  getDashboard,
  getDeleteTaskNotFoundError,
  getInvalidCredentialsError,
  getInvalidRefreshTokenError,
  getTaskDetail,
  getTaskNotFoundError,
  getTaskPage,
  getUnauthorizedError,
  getUser,
  hasValidRefreshTokenCookie,
  isAuthorizedRequest,
  isValidSignIn,
  REFRESH_TOKEN,
} from "@/shared/api/mock-backend";

export const handlers = [
  http.post("/api/sign-in", async ({ request }) => {
    await delay(400);
    const payload = (await request.json()) as SignInRequest;

    if (!isValidSignIn(payload)) {
      return HttpResponse.json(getInvalidCredentialsError(), { status: 400 });
    }

    return HttpResponse.json(getAuthTokens(), {
      status: 200,
      headers: {
        "Set-Cookie": `token=${REFRESH_TOKEN}; Path=/; SameSite=Lax`,
      },
    });
  }),
  http.post("/api/refresh", async ({ request }) => {
    await delay(250);

    if (!hasValidRefreshTokenCookie(request)) {
      return HttpResponse.json(getInvalidRefreshTokenError(), { status: 401 });
    }

    return HttpResponse.json(getAuthTokens());
  }),
  http.get("/api/user", async ({ request }) => {
    await delay(250);

    if (!isAuthorizedRequest(request)) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    return HttpResponse.json(getUser());
  }),
  http.get("/api/dashboard", async ({ request }) => {
    await delay(250);

    if (!isAuthorizedRequest(request)) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    return HttpResponse.json(getDashboard());
  }),
  http.get("/api/task", async ({ request }) => {
    await delay(350);

    if (!isAuthorizedRequest(request)) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");

    return HttpResponse.json(getTaskPage(page));
  }),
  http.get("/api/task/:id", async ({ params, request }) => {
    await delay(250);

    if (!isAuthorizedRequest(request)) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    const task = getTaskDetail(String(params.id));

    if (!task) {
      return HttpResponse.json(getTaskNotFoundError(), { status: 404 });
    }

    return HttpResponse.json(task);
  }),
  http.delete("/api/task/:id", async ({ params, request }) => {
    await delay(250);

    if (!isAuthorizedRequest(request)) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    const result = deleteTaskById(String(params.id));

    if (!result) {
      return HttpResponse.json(getDeleteTaskNotFoundError(), { status: 404 });
    }

    return HttpResponse.json(result);
  }),
];
