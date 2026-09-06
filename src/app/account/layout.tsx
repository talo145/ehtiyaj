import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountProvider } from "@/components/account/AccountState";
import { AccountShell } from "@/components/account/AccountShell";
import { getAccountSnapshot } from "@/server/queries";

export const metadata: Metadata = {
  title: { default: "حسابي", template: "%s · احتياج" },
  /** منطقة خاصة بالمستفيد — لا تُفهرس. */
  robots: { index: false, follow: false },
};

/** الحساب يُبنى لكل طلب: لا يُخزَّن مؤقتًا ولا يُولَّد مسبقًا. */
export const dynamic = "force-dynamic";

/** حساب المستفيد: واجهة مستقلة عن الموقع العام — لا هيدر الموقع ولا فوتره. */
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const snapshot = await getAccountSnapshot();
  if (!snapshot) redirect("/login");

  return (
    <AccountProvider snapshot={snapshot}>
      <AccountShell>{children}</AccountShell>
    </AccountProvider>
  );
}
