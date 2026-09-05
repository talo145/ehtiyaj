import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { AssociationsBrowser } from "@/components/associations/AssociationsBrowser";
import { associations } from "@/data/associations";

export const metadata: Metadata = {
  title: "الجمعيات",
  description:
    "الجمعيات المعتمَدة في منصة احتياج، لكل واحدة نطاق تغطية جغرافي وتصنيفي محدّد داخل منطقة الحدود الشمالية.",
};

export default function AssociationsPage() {
  return (
    <section className="section" aria-label="الجمعيات المسجّلة">
      <div className="wrap">
        <PageHeader
          crumb="الجمعيات"
          title="الجمعيات المسجّلة في احتياج"
          subtitle="كل جمعية هنا معتمَدة، ولها نطاق تغطية جغرافي وتصنيفي محدّد، فلا تصلها إلا الاحتياجات التي تخصّها فعلًا."
        />

        <AssociationsBrowser />

        <div className="join-bar">
          <div>
            <h3>هل تمثّل جمعية؟</h3>
            <p>
              سجّل جمعيتك وحدّد نطاق تغطيتها، لتصلك الاحتياجات التي تخصّك أنت لا
              كل شيء.
            </p>
          </div>
          <Button
            href="/register/association"
            variant="cta"
            size="lg"
            withArrow
          >
            انضم كجمعية
          </Button>
        </div>

        <p className="data-note">
          {associations.length} جمعية مسجّلة — بيانات تجريبية للعرض، والأرقام
          مجمّعة ولا تكشف أي بيان شخصي.
        </p>
      </div>
    </section>
  );
}
