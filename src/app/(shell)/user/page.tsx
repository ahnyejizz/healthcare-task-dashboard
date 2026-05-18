import type { Metadata } from "next";
import { userFixture } from "@/shared/mocks/data/seed";
import { UserProfileCard } from "@/widgets/user-profile/ui/user-profile-card";

export const metadata: Metadata = {
  title: "회원정보",
};

export default function UserPage() {
  return <UserProfileCard user={userFixture} />;
}
