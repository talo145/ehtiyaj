/** حالة الفراغ المصمّمة. البيانات الفعلية تقتصر على الحدود الشمالية،
 *  فحالة «لا توجد بيانات» متوقّعة كثيرًا وليست استثناءً. */
export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[18px] border border-dashed border-[color:var(--line)] px-6 py-12 text-center">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        className="text-dim"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" strokeLinecap="round" />
      </svg>
      <b className="text-[0.98rem] font-semibold">{title}</b>
      {hint ? (
        <p className="m-0 max-w-[44ch] text-[0.88rem] text-muted">{hint}</p>
      ) : null}
      {action}
    </div>
  );
}
