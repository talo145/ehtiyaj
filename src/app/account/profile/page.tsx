import type { Metadata } from "next";
import { ProfileView } from "@/components/account/views/ProfileView";

export const metadata: Metadata = {
  title: "الملف الشخصي",
  description: "بيانات حسابك ووسيلة التواصل معك.",
};

export default function Page() {
  return <ProfileView />;
}
