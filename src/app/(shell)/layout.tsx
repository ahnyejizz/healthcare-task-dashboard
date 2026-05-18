import { AppShell } from "@/widgets/navigation/ui/app-shell";

type ShellLayoutProps = {
  children: React.ReactNode;
};

export default function ShellLayout({ children }: ShellLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
