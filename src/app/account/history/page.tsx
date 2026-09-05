import type { Metadata } from "next";
import { HistoryView } from "@/components/account/views/HistoryView";

export const metadata: Metadata = {
  title: "سجل احتياجاتي",
  description: "احتياجاتك السابقة بحالتها النهائية.",
};

export default function Page() {
  return <HistoryView />;
}
