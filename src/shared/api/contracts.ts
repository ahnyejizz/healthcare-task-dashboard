export type TaskStatus = "TODO" | "DONE";

export type SignInRequest = {
  email: string;
  password: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type ErrorResponse = {
  errorMessage: string;
};

// 자체적으로 별도 추가
export type SuccessResponse = {
  success: true;
};

export type UserResponse = {
  name: string;
  memo: string;
};

export type DashboardResponse = {
  numOfTask: number;
  numOfRestTask: number;
  numOfDoneTask: number;
};

export type TaskItem = {
  id: string;
  title: string;
  memo: string;
  status: TaskStatus;
};

export type TaskListResponse = {
  data: TaskItem[];
  hasNext: boolean;
};

export type TaskDetailResponse = {
  title: string;
  memo: string;
  registerDatetime: string;
};

export type DeleteTaskResponse = SuccessResponse;

// 자체적으로 별도 추가
export type SessionResponse = {
  email: string;
};