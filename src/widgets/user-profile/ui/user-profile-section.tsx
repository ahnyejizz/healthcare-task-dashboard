"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/shared/api/http";
import { getUser } from "@/shared/api/user";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button";
import { Panel } from "@/shared/ui/panel";
import { UserProfileCard } from "@/widgets/user-profile/ui/user-profile-card";

export function UserProfileSection() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
  });

  if (isLoading) {
    return (
      <Panel
        title="회원정보"
        description="회원 이메일을 확인할 수 있는 화면입니다."
      >
        <div className="rounded-[24px] border border-border bg-white p-5 text-sm text-text-muted">
          회원정보를 불러오는 중입니다.
        </div>
      </Panel>
    );
  }

  if (error || !data) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : "회원정보를 불러오지 못했습니다.";
    const needsLogin = error instanceof ApiError && error.status === 401;

    return (
      <Panel
        title="회원정보"
        description="회원 이메일을 확인할 수 있는 화면입니다."
      >
        <div className="rounded-[24px] border border-border bg-white p-5">
          <p className="text-sm leading-6 text-text-muted">{errorMessage}</p>
          {needsLogin ? (
            <div className="mt-4">
              <ButtonLink href={routes.signIn}>로그인하러 가기</ButtonLink>
            </div>
          ) : null}
        </div>
      </Panel>
    );
  }

  return <UserProfileCard user={data} />;
}
