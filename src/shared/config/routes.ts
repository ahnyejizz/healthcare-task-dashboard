export const routes = {
  dashboard: "/",
  signIn: "/sign-in",
  taskList: "/task",
  user: "/user",
} as const;

export const primaryNavigation = [
  {
    href: routes.dashboard,
    label: "대시보드",
    icon: "dashboard",
  },
  {
    href: routes.taskList,
    label: "할 일",
    icon: "tasks",
  },
] as const;
