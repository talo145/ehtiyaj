import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeedsMapExplorer } from "@/components/needsmap/NeedsMapExplorer";

export const metadata: Metadata = {
  title: "خريطة الاحتياج",
  description:
    "التوزيع الجغرافي للاحتياجات المسجّلة في منطقة الحدود الشمالية، بأرقام مجمّعة على مستوى المدينة والقرية.",
};

export default function NeedsMapPage() {
  return (
    <section className="section" aria-label="خريطة الاحتياج">
      <div className="wrap">
        <PageHeader
          crumb="خريطة الاحتياج"
          title="أين يتركّز الاحتياج ولماذا؟"
          subtitle="الخريطة تُظهر التوزيع الجغرافي، والتحليلات تحتها تُظهر نوع الاحتياج وأولويته وأعلى المدن — كلها على نفس التصفية."
        />

        <NeedsMapExplorer />

        <p className="data-note">
          حدود المنطقة ومواقع المدن والقرى من بيانات مفتوحة · أعداد الاحتياج
          وبيانات الجمعيات تجريبية للعرض، وتُستبدل بالبيانات الفعلية دون تغيير
          الخريطة أو التحليلات.
        </p>
      </div>
    </section>
  );
}
