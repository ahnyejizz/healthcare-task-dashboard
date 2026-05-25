// shared
import type {
  DashboardResponse,
  DeleteTaskResponse,
  SessionResponse,
  TaskDetailResponse,
  TaskListResponse,
  UserResponse,
} from "@/shared/api/api-types";
import { tasksFixture, userFixtureByEmail } from "@/shared/mocks/data/seed";

const PAGE_SIZE = 10;
const taskStore = tasksFixture.map((task, index) => ({
  ...task,
  registerDatetime: new Date(
    Date.UTC(2026, 4, (index % 28) + 1, 9 + (index % 5), 10),
  ).toISOString(),
}));

/**
 * @page  - [회원정보]
 * @title - 세션 응답 생성 함수
 * @desc  - 현재 로그인 사용자의 세션 응답 객체를 생성
 */
export function getSession(email: string): SessionResponse {
  return {
    email,
  };
}

/**
 * @page  - [회원정보]
 * @title - 회원정보 응답 생성 함수
 * @desc  - 사용자 fixture를 기반으로 회원정보 응답 객체를 반환
 */
export function getUser(email: string): UserResponse {
  return (
    userFixtureByEmail[email] ?? {
      name: "-",
      memo: `${email} 계정의 회원정보가 아직 준비되지 않았습니다.`,
    }
  );
}

/**
 * @page  - [대시보드]
 * @title - 대시보드 지표 생성 함수
 * @desc  - 전체/남은 일/완료한 일 개수를 계산해 대시보드 응답 객체를 반환
 */
export function getDashboard(): DashboardResponse {
  return {
    numOfTask: taskStore.length,
    numOfRestTask: taskStore.filter((task) => task.status === "TODO").length,
    numOfDoneTask: taskStore.filter((task) => task.status === "DONE").length,
  };
}

/**
 * @page  - [할 일 목록]
 * @title - 할 일 목록 응답 생성 함수
 * @desc  - page 기준으로 taskStore를 잘라 페이지네이션된 목록 응답 객체를 반환
 */
export function getTaskPage(page: number): TaskListResponse {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return {
    data: taskStore.slice(start, end).map((task) => ({
      id: task.id,
      title: task.title,
      memo: task.memo,
      status: task.status,
    })),
    hasNext: end < taskStore.length,
  };
}

/**
 * @page  - [할 일 상세]
 * @title - 할 일 상세 응답 생성 함수
 * @desc  - id에 해당하는 할 일 상세 정보를 찾아 응답 객체를 반환
 */
export function getTaskDetail(id: string): TaskDetailResponse | null {
  const task = taskStore.find((item) => item.id === id);

  if (!task) {
    return null;
  }

  return {
    title: task.title,
    memo: task.memo,
    registerDatetime: task.registerDatetime,
  };
}

/**
 * @page  - [할 일 상세]
 * @title - 할 일 삭제 처리 함수
 * @desc  - id에 해당하는 할 일을 taskStore에서 제거하고 성공 응답을 반환
 */
export function deleteTaskById(id: string): DeleteTaskResponse | null {
  const taskIndex = taskStore.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return null;
  }

  taskStore.splice(taskIndex, 1);

  return {
    success: true,
  };
}
