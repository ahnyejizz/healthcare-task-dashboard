import type { ReactNode } from "react";

type PanelProps = {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  paddingClassName?: string;
  title?: string;
};

export function Panel({
  action,
  children,
  className,
  contentClassName,
  description,
  paddingClassName,
  title,
}: PanelProps) {
  return (
    <section
      className={[
        "surface-card rounded-[28px]",
        paddingClassName ?? "p-6 lg:p-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title ? (
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              {title}
            </h1>
            {description ? (
              <div className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
                {description}
              </div>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
