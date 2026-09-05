import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { InitiativesBrowser } from "@/components/initiatives/InitiativesBrowser";
import { initiatives } from "@/data/initiatives";

export const metadata: Metadata = {
  title: "المبادرات",
  description:
    "مبادرات بُنيت على احتياجات مسجّلة داخل منطقة الحدود الشمالية، بحالتها والجهة المنفّذة ونطاقها.",
};

export default function InitiativesPage() {
  return (
    <section className="section" aria-label="المبادرات">
      <div className="wrap">
        <PageHeader
          crumb="المبادرات"
          title="مبادرات بُنيت على احتياج مسجّل"
          subtitle="كل مبادرة هنا انطلقت من أرقام فعلية داخل منطقة الحدود الشمالية، لا من تقدير. تابع حالتها ومَن ينفّذها وأين."
        />

        <InitiativesBrowser />

        <div className="join-bar">
          <div>
            <h3>هل تمثّل جمعية؟</h3>
            <p>
              ابنِ مبادرتك على أرقام الاحتياج داخل نطاق تغطيتك، لا على التقدير.
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
          {initiatives.length} مبادرة — بيانات تجريبية للعرض.
        </p>
      </div>
    </section>
  );
}
