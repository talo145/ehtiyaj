import type { Metadata } from "next";
import { NeedView } from "@/components/account/views/NeedView";

export const metadata: Metadata = {
  title: "احتياجي",
  description: "تفاصيل احتياجك القائم ومساره.",
};

export default function Page() {
  return <NeedView />;
}
