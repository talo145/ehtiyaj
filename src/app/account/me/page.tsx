import type { Metadata } from "next";
import { MeView } from "@/components/account/views/MeView";

export const metadata: Metadata = {
  title: "حسابي",
  description: "بياناتك وإعدادات حسابك.",
};

export default function Page() {
  return <MeView />;
}
