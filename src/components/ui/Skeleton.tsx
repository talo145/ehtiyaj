import { cn } from "@/lib/cn";

/** هيكل تحميل بدل مساحة بيضاء ريثما تصل البيانات من الـ API لاحقًا. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-[12px] bg-[rgba(234,242,245,0.06)] motion-reduce:animate-none",
        className,
      )}
    />
  );
}

/** بطاقة تحميل بمقاسات بطاقة الجمعية، تُستعمل في شبكات القوائم. */
export function CardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[18px] border border-[color:var(--line)] p-[22px]">
      <Skeleton className="h-[60px] w-[60px] rounded-[19px]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="mt-2 h-10 w-full rounded-[11px]" />
    </div>
  );
}
