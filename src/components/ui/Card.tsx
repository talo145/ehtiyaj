import { cn } from "@/lib/cn";

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  /** `solid` أغمق من الأساس — تستعمله بطاقات المبادرات فوق الخلفية المنقوشة. */
  tone?: "translucent" | "solid";
  interactive?: boolean;
}

/** البطاقة الموحّدة: جمعية، مبادرة، فرصة تطوع، ونداء ختامي — بفروق محتوى لا شكل. */
export function Card({
  tone = "translucent",
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-[color:var(--line)]",
        tone === "translucent"
          ? "bg-[rgba(234,242,245,0.04)]"
          : "bg-[rgba(3,9,16,0.66)]",
        interactive &&
          "transition-[border-color,background-color] duration-250 hover:border-[rgba(22,179,160,0.45)] " +
            (tone === "translucent"
              ? "hover:bg-[rgba(234,242,245,0.06)]"
              : "hover:bg-[rgba(4,12,20,0.8)]"),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
