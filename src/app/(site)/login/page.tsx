import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "ادخل إلى حسابك في احتياج لتسجيل احتياج جديد أو متابعة حالته.",
};

export default function LoginPage() {
  return (
    <AuthShell
      kicker="حساب فرد"
      title="تسجيل الدخول"
      subtitle="ادخل إلى حسابك لتسجيل احتياج جديد أو متابعة حالة احتياجك."
      asideKicker="للمستفيدين"
      asideTitle="احتياجك يبدأ منك أنت."
      asideText="لا تستطيع أي جمعية تسجيل احتياج نيابةً عنك. أنت من يسجّله، وأنت من يتابع حالته حتى تصل الاستجابة."
      asidePoints={[
        "تسجّل احتياجك في دقائق بنموذج منظّم",
        "تتابع حالته من الاستلام حتى الاستجابة",
        "الجمعية ترى اسمك ووسيلة تواصلك واحتياجك فقط — لا ملفك الكامل",
      ]}
      footer={
        <>
          ليس لديك حساب؟ <Link href="/register/beneficiary">أنشئ حساب فرد</Link>
        </>
      }
    >
      <LoginForm
        emailLabel="البريد الإلكتروني"
        emailPlaceholder="name@example.com"
        submitLabel="تسجيل الدخول"
      />
    </AuthShell>
  );
}
