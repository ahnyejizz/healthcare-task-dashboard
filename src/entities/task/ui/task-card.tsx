import Link from "next/link";
import type { TaskItem } from "@/shared/api/contracts";

type TaskCardProps = {
  task: TaskItem;
};

export function TaskCard({ task }: TaskCardProps) {
  const cardClass =
    task.status === "DONE"
      ? "border-status-done-strong/35 bg-status-done-surface hover:bg-status-done-surface"
      : "border-status-todo-strong/35 bg-status-todo-surface hover:bg-status-todo-surface";
  const badgeClass =
    task.status === "DONE"
      ? "border border-status-done-strong/20 bg-white text-status-done-strong"
      : "border border-status-todo-strong/20 bg-white text-status-todo-strong";
  const idClass =
    task.status === "DONE" ? "text-status-done-strong" : "text-status-todo-strong";

  return (
    <Link
      href={`/task/${task.id}`}
      className={[
        "group block rounded-[24px] border p-9 outline-none transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] focus-visible:shadow-[0_0_0_2px_var(--color-surface)]",
        cardClass,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={[
              "text-[11px] font-semibold tracking-[0.16em] uppercase",
              idClass,
            ].join(" ")}
          >
            {task.id}
          </p>
          <h2 className="mt-2.5 text-[1.02rem] leading-tight font-semibold tracking-tight text-text">
            {task.title}
          </h2>
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-[0.12em] ${badgeClass}`}
        >
          {task.status}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-text-muted">{task.memo}</p>
    </Link>
  );
}
