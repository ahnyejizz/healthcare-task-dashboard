import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  rightComponents?: ReactNode;
  title?: string;
};

export function Panel({
  children,
  className,
  contentClassName,
  description,
  rightComponents,
  title,
}: PanelProps) {
  return (
    <section
      className={["surface-card rounded-[28px]", "px-6 py-5 lg:px-8 lg:py-7", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title ? (
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
            {description ? (
              <div className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">{description}</div>
            ) : null}
          </div>
          {rightComponents ? <div className="shrink-0">{rightComponents}</div> : null}
        </header>
      ) : null}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
