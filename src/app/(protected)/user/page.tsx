import type { Metadata } from "next";
import { UserProfileSection } from "@/widgets/user-profile/ui/user-profile-section";

export const metadata: Metadata = {
  title: "회원정보",
};

export default function UserPage() {
  return (
    <div className="h-full min-h-0">
      <UserProfileSection />
    </div>
  );
}
