import { delay, http, HttpResponse } from "msw";

// shared
import type { SignInRequest } from "@/shared/api/contracts";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  deleteTaskById,
  getAuthTokens,
  getAuthorizedEmail,
  getDashboard,
  getDeleteTaskNotFoundError,
  getInvalidCredentialsError,
  getInvalidRefreshTokenError,
  getMissingRefreshTokenError,
  getRefreshTokenEmail,
  getSession,
  getTaskDetail,
  getTaskNotFoundError,
  getTaskPage,
  getUnauthorizedError,
  getUser,
  hasRefreshTokenCookie,
  hasValidRefreshTokenCookie,
  isAuthorizedRequest,
  isValidSignIn,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/mocks/mock-backend";

export const handlers = [
  // sign-in
  http.post("/api/sign-in", async ({ request }) => {
    await delay(400);
    const payload = (await request.json()) as SignInRequest;

    if (!isValidSignIn(payload)) {
      return HttpResponse.json(getInvalidCredentialsError(), { status: 400 });
    }

    const tokens = getAuthTokens(payload.email);
    const headers = new Headers();

    headers.append(
      "Set-Cookie",
      `${ACCESS_TOKEN_COOKIE_NAME}=${tokens.accessToken}; Path=/; SameSite=Lax`,
    );
    headers.append(
      "Set-Cookie",
      `${REFRESH_TOKEN_COOKIE_NAME}=${tokens.refreshToken}; Path=/; SameSite=Lax`,
    );

    return HttpResponse.json(tokens, {
      status: 200,
      headers,
    });
  }),

  // refresh
  http.post("/api/refresh", async ({ request }) => {
    await delay(250);

    if (!hasRefreshTokenCookie(request)) {
      return HttpResponse.json(getMissingRefreshTokenError(), { status: 400 });
    }

    if (!hasValidRefreshTokenCookie(request)) {
      return HttpResponse.json(getInvalidRefreshTokenError(), { status: 401 });
    }

    const email = getRefreshTokenEmail(request);

    if (!email) {
      return HttpResponse.json(getInvalidRefreshTokenError(), { status: 401 });
    }

    const tokens = getAuthTokens(email);
    const headers = new Headers();

    headers.append(
      "Set-Cookie",
      `${ACCESS_TOKEN_COOKIE_NAME}=${tokens.accessToken}; Path=/; SameSite=Lax`,
    );
    headers.append(
      "Set-Cookie",
      `${REFRESH_TOKEN_COOKIE_NAME}=${tokens.refreshToken}; Path=/; SameSite=Lax`,
    );

    return HttpResponse.json(tokens, {
      status: 200,
      headers,
    });
  }),

  // user
  http.get("/api/user", async ({ request }) => {
    await delay(250);

    if (!isAuthorizedRequest(request)) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    const email = getAuthorizedEmail(request);

    if (!email) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    return HttpResponse.json(getUser(email));
  }),

  // session
  http.get("/api/session", async ({ request }) => {
    await delay(250);

    if (!isAuthorizedRequest(request)) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    const email = getAuthorizedEmail(request);

    if (!email) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    return HttpResponse.json(getSession(email));
  }),

  // dashboard
  http.get("/api/dashboard", async ({ request }) => {
    await delay(250);

    if (!isAuthorizedRequest(request)) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    return HttpResponse.json(getDashboard());
  }),

  // task
  http.get("/api/task", async ({ request }) => {
    await delay(350);

    if (!isAuthorizedRequest(request)) {
      return HttpResponse.json(getUnauthorizedError(), { status: 401 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");

    return HttpResponse.json(getTaskPage(page));
  }),

  // task/:id - get
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

  // task/:id - delete
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

  // sign-out
  http.post("/api/sign-out", async () => {
    await delay(150);

    const headers = new Headers();

    headers.append("Set-Cookie", `${ACCESS_TOKEN_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0`);
    headers.append("Set-Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0`);

    return HttpResponse.json(
      { success: true },
      {
        status: 200,
        headers,
      },
    );
  }),
];
