import type {
  DashboardResponse,
  SignInRequest,
  TaskDetailResponse,
  TaskItem,
  UserResponse,
} from "@/shared/api/contracts";

const TOTAL_TASKS = 80;

export const mockCredentials: SignInRequest = {
  email: "test@naver.com",
  password: "frontend2026",
};

export const userFixtureByEmail: Record<string, UserResponse> = {
  "test@naver.com": {
    name: "안예지",
    memo: "건강 루틴을 꾸준히 관리할 수 있는 화면 흐름을 점검 중입니다.",
  },
};

export const tasksFixture: TaskItem[] = Array.from(
  { length: TOTAL_TASKS },
  (_, index) => ({
    id: `task-${String(index + 1).padStart(3, "0")}`,
    title: `건강 루틴 개선 태스크 ${index + 1}`,
    memo: `건강 루틴 개선 태스크 ${index + 1}의 메모입니다.`,
    status: index % 3 === 0 ? "DONE" : "TODO",
  }),
);

export const dashboardFixture: DashboardResponse = {
  numOfTask: tasksFixture.length,
  numOfRestTask: tasksFixture.filter((task) => task.status === "TODO").length,
  numOfDoneTask: tasksFixture.filter((task) => task.status === "DONE").length,
};

export function getTaskDetailFixture(id: string): TaskDetailResponse | null {
  const taskIndex = tasksFixture.findIndex((task) => task.id === id);
  const task = tasksFixture[taskIndex];

  if (!task) {
    return null;
  }

  return {
    title: task.title,
    memo: task.memo,
    registerDatetime: new Date(
      Date.UTC(2026, 4, (taskIndex % 28) + 1, 9 + (taskIndex % 5), 10),
    ).toISOString(),
  };
}
