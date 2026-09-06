"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useAccount } from "../AccountState";
import { ClockIcon } from "../icons";
import { HistoryRows, ui } from "../pieces";
import type { NeedStatusValue } from "@/server/view-types";

const filters: { key: "all" | NeedStatusValue; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "responded", label: "تمت الاستجابة" },
  { key: "withdrawn", label: "مغلق" },
];

export function HistoryView() {
  const { history } = useAccount();
  const [filter, setFilter] = useState<"all" | NeedStatusValue>("all");

  const shown =
    filter === "all"
      ? history
      : history.filter((h) =>
          filter === "withdrawn"
            ? h.status === "withdrawn" || h.status === "closed"
            : h.status === filter,
        );

  return (
    <>
      <div className={ui.head}>
        <h1>سجل احتياجاتي</h1>
      </div>

      <p className={ui.text} style={{ marginBottom: 16 }}>
        كل احتياج سجّلته يبقى في سجلّك بحالته النهائية. السجل لا يُحذف، لأنه
        أساس قياس الأثر.
      </p>

      {history.length ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "cursor-pointer rounded-full border border-[color:var(--line)] bg-transparent",
                  "px-3.5 py-2 text-[0.84rem] transition-colors",
                  filter === f.key
                    ? "border-accent bg-[rgba(22,179,160,0.14)] font-semibold text-accent"
                    : "text-muted hover:text-ink",
                )}
              >
                {f.label}
                {f.key === "all" ? ` · ${history.length}` : null}
              </button>
            ))}
          </div>

          {shown.length ? (
            <HistoryRows items={shown} />
          ) : (
            <p className={ui.sub}>لا احتياجات بهذه الحالة.</p>
          )}
        </>
      ) : (
        <div className={ui.empty}>
          <span className={ui.emptyIcon} aria-hidden="true">
            <ClockIcon size={28} />
          </span>
          <h2>سجلّك فارغ</h2>
          <p>
            لم تسجّل احتياجًا بعد. أول احتياج تسجّله يظهر هنا بعد إغلاقه، بحالته
            النهائية.
          </p>
        </div>
      )}
    </>
  );
}
