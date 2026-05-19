import { routes } from "@/shared/config/routes";

export const protectedPageMeta = {
  dashboard: {
    title: "대시보드",
    description: "할 일 현황을 대시보드 형태로 한눈에 확인할 수 있는 화면입니다.",
  },
  taskList: {
    title: "할 일 목록",
    description: "할 일을 카드 형태로 확인할 수 있는 화면입니다.",
  },
  taskDetail: {
    title: "할 일 상세",
    description: "선택한 할 일의 상세 내용을 확인할 수 있는 화면입니다.",
  },
  user: {
    title: "회원정보",
    description: "회원 정보를 확인할 수 있는 화면입니다.",
  },
} as const;

export function resolveProtectedPageMeta(pathname: string) {
  if (pathname.startsWith(routes.user)) {
    return protectedPageMeta.user;
  }

  if (pathname.startsWith("/task/")) {
    return protectedPageMeta.taskDetail;
  }

  if (pathname.startsWith(routes.taskList)) {
    return protectedPageMeta.taskList;
  }

  return protectedPageMeta.dashboard;
}
