import type { Metadata } from "next";
import { CompleteProfileView } from "@/components/account/views/CompleteProfileView";

export const metadata: Metadata = {
  title: "إكمال بياناتي",
  description: "البيانات المطلوبة قبل تسجيل أي احتياج.",
};

export default function Page() {
  return <CompleteProfileView />;
}
