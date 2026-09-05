import { Button } from "@/components/ui/Button";

export const metadata = { title: "الصفحة غير موجودة" };

export default function NotFound() {
  return (
    <section className="section" aria-label="صفحة غير موجودة">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow mono">404</p>
          <h2>الصفحة غير موجودة</h2>
          <p>
            الرابط الذي وصلت منه لم يعد موجودًا، أو أن هذه الصفحة لم تُبنَ بعد
            في هذه المرحلة من المنصة.
          </p>
        </div>
        <div className="flex justify-center">
          <Button href="/" variant="cta" size="lg" withArrow>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </section>
  );
}
