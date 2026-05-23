import type { Metadata } from "next";
import { pageMeta } from "@/shared/config/page-meta";
import { UserProfilePage } from "@/widgets/user-profile/ui/user-profile-page";

export const metadata: Metadata = {
  title: pageMeta.user.title,
};

/**
 * @page  - [회원정보]
 * @title - 회원정보 라우트 페이지
 * @desc  - 회원정보 라우트 진입점, UserProfilePage 컴포넌트 렌더링
 */
export default function UserPage() {
  return (
    <div className="h-full min-h-0">
      <UserProfilePage />
    </div>
  );
}
