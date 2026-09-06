import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

/** هيكل الموقع العام. حساب المستفيد خارج هذه المجموعة عمدًا: واجهة مستقلة بلا
 *  هيدر الموقع ولا فوتره ولا روابطه. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="content">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
