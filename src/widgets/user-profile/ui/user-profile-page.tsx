"use client";

import { useQuery } from "@tanstack/react-query";
import { pageMeta } from "@/shared/config/page-meta";
import { ApiError } from "@/shared/api/http";
import { queryKeys } from "@/shared/api/query-keys";
import { getSession, getUser } from "@/shared/api/user";
import { routes } from "@/shared/config/routes";
import { ButtonLink } from "@/shared/ui/button/button";
import { LoadingOverlay } from "@/shared/ui/loading/loading-overlay";
import { Panel } from "@/shared/ui/panel";
import { UserProfileCard } from "@/widgets/user-profile/ui/user-profile-card";

/**
 * @page  - [회원정보]
 * @title - 회원정보 메인 페이지
 * @desc  - 데이터 처리 및 가공 후 UserProfileCard 컴포넌트에 데이터 전달
 */
export function UserProfilePage() {
  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const [user, session] = await Promise.all([getUser(), getSession()]);
      return {
        email: session.email,
        user,
      };
    },
    retry: false,
  });

  const needsLogin = error instanceof ApiError && error.status === 401;

  const errorMessage =
    error instanceof ApiError ? error.message : "회원정보를 불러오지 못했습니다.";

  /* ================================================================================== */
  /* render */
  /* ================================================================================== */

  // 초기 로딩
  if (isLoading) {
    return <LoadingOverlay message="회원정보를 불러오는 중입니다." />;
  }

  // 조회 실패
  if (error || !data) {
    return (
      <Panel
        title={pageMeta.user.title}
        description={pageMeta.user.description}
        className="flex h-full min-h-0 flex-col"
        contentClassName="flex-1"
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

  // 조회 성공
  return <UserProfileCard email={data.email} user={data.user} />;
}
