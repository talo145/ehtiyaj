import { cn } from "@/lib/cn";
import type { InitiativeStatus } from "@/types";

export type BadgeTone = "neutral" | "active" | "upcoming" | "completed";

const tones: Record<BadgeTone, string> = {
  neutral: "text-muted",
  active:
    "text-accent border-[rgba(22,179,160,0.45)] bg-[rgba(22,179,160,0.1)]",
  upcoming:
    "text-[#F0A272] border-[rgba(240,162,114,0.35)] bg-[rgba(240,162,114,0.08)]",
  completed: "text-muted bg-[rgba(234,242,245,0.05)]",
};

/** يترجم حالة المبادرة إلى نبرة البطاقة. */
export const toneOfStatus: Record<InitiativeStatus, BadgeTone> = {
  active: "active",
  completed: "completed",
  upcoming: "upcoming",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border border-[color:var(--line)]",
        "px-[11px] py-1 text-[0.72rem] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
