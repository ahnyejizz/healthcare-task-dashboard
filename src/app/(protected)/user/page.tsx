import type { Metadata } from "next";
import { pageMeta } from "@/shared/config/page-meta";
import { UserProfilePage } from "@/widgets/user-profile/ui/user-profile-page";

export const metadata: Metadata = {
  title: pageMeta.user.title,
};

export default function UserPage() {
  return (
    <div className="h-full min-h-0">
      <UserProfilePage />
    </div>
  );
}
