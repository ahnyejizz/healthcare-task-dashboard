import type { Metadata } from "next";
import { tasksFixture } from "@/shared/mocks/data/seed";
import { TaskListScaffold } from "@/widgets/task-list/ui/task-list-scaffold";

export const metadata: Metadata = {
  title: "할 일 목록",
};

export default function TaskListPage() {
  return <TaskListScaffold tasks={tasksFixture.slice(0, 10)} />;
}
