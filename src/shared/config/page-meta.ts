import { routes } from "@/shared/config/routes";

export const pageMeta = {
  dashboard: {
    title: "대시보드",
    description: "태스크 현황을 대시보드 형태로 한눈에 확인할 수 있는 화면입니다.",
  },
  taskList: {
    title: "할 일 목록",
    description: "할 일을 카드 형태 또는 리스트 형태로 확인할 수 있는 화면입니다.",
  },
  taskDetail: {
    title: "할 일 상세",
    description: "선택한 할 일의 상세 내용을 확인할 수 있는 화면입니다.",
  },
  user: {
    title: "회원정보",
    description: "회원 정보를 확인할 수 있는 화면입니다.",
  },
  signIn: {
    title: "로그인",
    description: "MSW 기반의 테스트 계정으로 이메일과 비밀번호를 입력해 로그인할 수 있는 화면입니다.",
  },
} as const;

export function resolvePageMeta(pathname: string) {
  if (pathname.startsWith(routes.signIn)) {
    return pageMeta.signIn;
  }

  if (pathname.startsWith(routes.user)) {
    return pageMeta.user;
  }

  if (pathname.startsWith("/task/")) {
    return pageMeta.taskDetail;
  }

  if (pathname.startsWith(routes.taskList)) {
    return pageMeta.taskList;
  }

  return pageMeta.dashboard;
}
