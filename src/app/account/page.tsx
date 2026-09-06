import type { Metadata } from "next";
import { DashboardView } from "@/components/account/views/DashboardView";

export const metadata: Metadata = {
  title: "لوحتي",
  description: "متابعة احتياجك الحالي وحالته.",
};

export default function Page() {
  return <DashboardView />;
}
