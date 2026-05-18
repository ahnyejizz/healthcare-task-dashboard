import type { ReactNode } from "react";

type PanelProps = {
  action?: ReactNode;
  children: ReactNode;
  description?: string;
  title?: string;
};

export function Panel({ action, children, description, title }: PanelProps) {
  return (
    <section className="surface-card rounded-[28px] p-6 lg:p-8">
      {title ? (
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
