import type { Metadata } from "next";
import { PrivacyView } from "@/components/account/views/PrivacyView";

export const metadata: Metadata = {
  title: "بياناتي وخصوصيتي",
  description: "من يرى بياناتك، وموافقاتك المسجّلة.",
};

export default function Page() {
  return <PrivacyView />;
}
