import type { UserResponse } from "@/shared/api/contracts";
import { Panel } from "@/shared/ui/panel";

type UserProfileCardProps = {
  user: UserResponse;
};

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Panel
      title="회원정보"
      description="회원 이메일을 확인할 수 있는 화면입니다."
    >
      <div className="grid gap-4">
        <article className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm font-medium text-text-muted">이메일</p>
          <strong className="mt-3 block text-2xl font-semibold text-text">
            {user.email}
          </strong>
        </article>
      </div>
    </Panel>
  );
}
