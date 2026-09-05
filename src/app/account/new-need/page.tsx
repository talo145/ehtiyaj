import type { Metadata } from "next";
import { NeedSurveyView } from "@/components/account/views/NeedSurveyView";

export const metadata: Metadata = {
  title: "استبانة الاحتياج",
  description: "سجّل احتياجك الصحي في ست خطوات.",
};

export default function Page() {
  return <NeedSurveyView />;
}
