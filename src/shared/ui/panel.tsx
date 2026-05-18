import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  description?: string;
  title?: string;
};

export function Panel({ children, description, title }: PanelProps) {
  return (
    <section className="surface-card rounded-[28px] p-6 lg:p-8">
      {title ? (
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
