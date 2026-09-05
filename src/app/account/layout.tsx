import type { Metadata } from "next";
import { AccountProvider } from "@/components/account/AccountState";
import { AccountShell } from "@/components/account/AccountShell";

export const metadata: Metadata = {
  title: { default: "حسابي", template: "%s · احتياج" },
  /** منطقة خاصة بالمستفيد — لا تُفهرس. */
  robots: { index: false, follow: false },
};

/** حساب المستفيد: واجهة مستقلة عن الموقع العام — لا هيدر الموقع ولا فوتره. */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountProvider>
      <AccountShell>{children}</AccountShell>
    </AccountProvider>
  );
}
