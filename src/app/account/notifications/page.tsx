import type { Metadata } from "next";
import { NotificationsView } from "@/components/account/views/NotificationsView";

export const metadata: Metadata = {
  title: "الإشعارات",
  description: "إشعارات تغيّر حالة احتياجك.",
};

export default function Page() {
  return <NotificationsView />;
}
