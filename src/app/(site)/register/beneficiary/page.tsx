import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { beneficiaryDocuments } from "@/data/legal";

export const metadata: Metadata = {
  title: "إنشاء حساب فرد",
  description: "أنشئ حسابك في احتياج لتسجيل احتياجك الصحي بنفسك ومتابعة حالته.",
};

export default function BeneficiaryRegisterPage() {
  return (
    <AuthShell
      wide
      kicker="حساب فرد"
      title="أنشئ حسابك"
      subtitle="بيانات الحساب فقط الآن. تفاصيل الاحتياج تُسجَّل لاحقًا من حسابك."
      asideKicker="قبل أن تبدأ"
      asideTitle="ماذا يعني إنشاء حساب في احتياج؟"
      asidePoints={[
        "أنت وحدك من يسجّل احتياجك — لا جمعية ولا وسيط",
        "بياناتك الصحية تُعامل كبيانات حسّاسة وفق نظام حماية البيانات الشخصية",
        "الموقع العام لا يعرض عنك شيئًا — الأرقام مجمّعة على مستوى المدينة",
        "يمكنك طلب حذف حسابك في أي وقت",
      ]}
      footer={
        <>
          لديك حساب؟ <Link href="/login">تسجيل الدخول</Link>
        </>
      }
    >
      <RegisterForm
        fields={[
          {
            key: "name",
            label: "الاسم الكامل",
            placeholder: "الاسم الأول واسم العائلة",
          },
        ]}
        emailLabel="البريد الإلكتروني"
        emailPlaceholder="name@example.com"
        emailHint="يُستخدم لتسجيل الدخول وإشعارات حالة احتياجك."
        documents={beneficiaryDocuments}
        connected
        submitLabel="إنشاء الحساب"
      />
    </AuthShell>
  );
}
