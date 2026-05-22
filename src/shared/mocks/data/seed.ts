import type {
  DashboardResponse,
  SignInRequest,
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

export const tasksFixture: TaskItem[] = Array.from({ length: TOTAL_TASKS }, (_, index) => ({
  id: `task-${String(index + 1).padStart(3, "0")}`,
  title: `건강 루틴 개선 태스크 ${index + 1}`,
  memo:
    index % 5 === 0
      ? `건강 루틴 개선 태스크 ${index + 1}의 메모입니다.`
      : "긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트 긴메모테스트",
  status: index % 3 === 0 ? "DONE" : "TODO",
}));

export const dashboardFixture: DashboardResponse = {
  numOfTask: tasksFixture.length,
  numOfRestTask: tasksFixture.filter((task) => task.status === "TODO").length,
  numOfDoneTask: tasksFixture.filter((task) => task.status === "DONE").length,
};
