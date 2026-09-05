import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "دخول الجمعيات",
  description:
    "لوحة جمعيتك في احتياج: الاحتياجات داخل نطاق تغطيتك ومبادراتك وأرقامك.",
};

export default function AssociationLoginPage() {
  return (
    <AuthShell
      kicker="حساب جمعية"
      title="دخول الجمعيات"
      subtitle="لوحة جمعيتك: الاحتياجات داخل نطاق تغطيتك، ومبادراتك، وأرقامك."
      asideKicker="للجمعيات"
      asideTitle="تصلكم الاحتياجات التي تخصّكم وحدها."
      asideText="نطاق التغطية هو ما يحدّد ما تراه جمعيتكم: محافظات بعينها وتصنيفات بعينها. لا قوائم عامة، ولا بيانات خارج صلاحيتكم."
      asideStats={[
        { value: "21", label: "جمعية معتمَدة" },
        { value: "65", label: "مبادرة قائمة" },
        { value: "6", label: "تصنيفات احتياج" },
      ]}
      asidePoints={["مبدأ أقل صلاحية: لا ملفات كاملة ولا بيانات صحية تفصيلية"]}
      footer={
        <>
          جمعيتكم غير مسجّلة؟{" "}
          <Link href="/register/association">أنشئ حساب جمعية</Link>
        </>
      }
    >
      <LoginForm
        emailLabel="البريد الإلكتروني للجهة"
        emailPlaceholder="name@association.org.sa"
        submitLabel="دخول لوحة الجمعية"
      />
    </AuthShell>
  );
}
