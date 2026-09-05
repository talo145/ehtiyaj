import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

/** الشعار: ثلاث حلقات متمركزة — نقطة الاحتياج ونطاقات الوصول حولها. */
export function Logo({
  className,
  size = 27,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "flex shrink-0 items-center gap-2.5 text-ink no-underline",
        className,
      )}
    >
      <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden="true">
        <circle
          cx="13"
          cy="13"
          r="11.2"
          fill="none"
          stroke="#16B3A0"
          strokeWidth="1.4"
          opacity=".4"
        />
        <circle
          cx="13"
          cy="13"
          r="6.4"
          fill="none"
          stroke="#16B3A0"
          strokeWidth="1.4"
          opacity=".72"
        />
        <circle cx="13" cy="13" r="2.6" fill="#16B3A0" />
      </svg>
      <b className="text-[1.2rem] font-bold tracking-[-0.01em]">{site.name}</b>
    </Link>
  );
}
