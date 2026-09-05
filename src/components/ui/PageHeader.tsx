import Link from "next/link";

interface PageHeaderProps {
  /** آخر عنصر في المسار — الصفحة الحالية. */
  crumb: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ crumb, title, subtitle }: PageHeaderProps) {
  return (
    <div className="page-head">
      <p className="crumb">
        <Link href="/">الرئيسية</Link> &rsaquo; {crumb}
      </p>
      <h1>{title}</h1>
      {subtitle ? <p className="sub">{subtitle}</p> : null}
    </div>
  );
}
