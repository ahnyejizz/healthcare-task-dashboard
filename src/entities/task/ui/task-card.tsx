import Link from "next/link";
import type { TaskItem } from "@/shared/api/contracts";

type TaskCardProps = {
  task: TaskItem;
};

export function TaskCard({ task }: TaskCardProps) {
  const badgeClass =
    task.status === "DONE"
      ? "bg-success/10 text-success"
      : "bg-warning/10 text-warning";

  return (
    <Link
      href={`/task/${task.id}`}
      className="focus-ring block rounded-[24px] border border-border bg-white p-5 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-text">{task.title}</h2>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
        >
          {task.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-text-muted">{task.memo}</p>
      <p className="mt-4 text-xs font-medium tracking-[0.12em] text-primary uppercase">
        상세 보기
      </p>
    </Link>
  );
}
