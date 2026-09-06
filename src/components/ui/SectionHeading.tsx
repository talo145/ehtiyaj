import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** عنصر يُعرض تحت العنوان — زر «كل الجمعيات» مثلًا. */
  action?: React.ReactNode;
  className?: string;
  /** مستوى العنوان؛ الصفحة الرئيسية تستعمل h2 دائمًا لأن h1 في قسم البطل. */
  as?: "h2" | "h3";
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  action,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("section-head", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag>{title}</Tag>
      {subtitle ? <p>{subtitle}</p> : null}
      {action}
    </div>
  );
}
