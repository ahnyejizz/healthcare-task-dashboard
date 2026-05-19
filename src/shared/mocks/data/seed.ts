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
    memo:
      index % 2 === 0
        ? "대시보드 지표와 연결될 수 있도록 상태와 설명이 함께 들어가는 카드입니다."
        : "가상 스크롤과 무한 스크롤을 붙일 것을 전제로 카드 메모 길이를 조금 길게 두었습니다.",
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
    memo: `${task.memo}\n\n상세 페이지에서는 삭제 확인용 ID 입력과 404 예외 처리를 함께 검증합니다.`,
    registerDatetime: new Date(
      Date.UTC(2026, 4, (taskIndex % 28) + 1, 9 + (taskIndex % 5), 10),
    ).toISOString(),
  };
}
