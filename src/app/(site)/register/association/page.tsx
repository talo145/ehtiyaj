import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { associationDocuments } from "@/data/legal";

export const metadata: Metadata = {
  title: "إنشاء حساب جمعية",
  description:
    "سجّل جهتكم في احتياج لتصلكم الاحتياجات داخل نطاق تغطيتكم المعتمَد.",
};

export default function AssociationRegisterPage() {
  return (
    <AuthShell
      wide
      kicker="حساب جمعية"
      title="أنشئ حساب جمعيتكم"
      subtitle="بيانات الحساب فقط الآن. نطاق التغطية والمستندات الرسمية تُستكمل بعد الاعتماد."
      asideKicker="قبل أن تبدأوا"
      asideTitle="ماذا يحدث بعد إنشاء الحساب؟"
      asidePoints={[
        "يمرّ الطلب بمراجعة إدارة المنصة قبل التفعيل",
        "تُطلب منكم المستندات الرسمية ورقم التسجيل في مرحلة التحقّق",
        "بعد الاعتماد تحدّدون نطاق التغطية: المحافظات والتصنيفات",
        "إن رُفض الطلب تصلكم رسالة بالسبب مع إمكانية إعادة التقديم",
      ]}
      footer={
        <>
          لديكم حساب؟ <Link href="/login/association">دخول الجمعيات</Link>
        </>
      }
    >
      <RegisterForm
        fields={[
          {
            key: "entity",
            label: "اسم الكيان",
            placeholder: "جمعية … / مؤسسة … / فريق … التطوعي",
            hint: "كما هو في السجل الرسمي للجهة.",
          },
          {
            key: "admin",
            label: "اسم مسؤول الحساب",
            placeholder: "الاسم الكامل للمسؤول",
          },
        ]}
        emailLabel="البريد الإلكتروني للجهة"
        emailPlaceholder="name@association.org.sa"
        emailHint="يُفضَّل بريد باسم نطاق الجهة، فهو أسرع في المراجعة."
        documents={associationDocuments}
        submitLabel="إنشاء الحساب وإرسال الطلب"
      />
    </AuthShell>
  );
}
