"use client";

import { useState } from "react";
import { useAnyDropdownOpen } from "./Dropdown";
import { cn } from "@/lib/cn";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  /** عدد الفلاتر المفعّلة — يظهر على زر الجوال. */
  activeCount: number;
  /** عدد الأعمدة على الشاشات الواسعة. */
  columns: number;
  children: React.ReactNode;
}

export function FilterBar({ activeCount, columns, children }: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const raised = useAnyDropdownOpen();

  return (
    <div
      className={cn(
        styles.filters,
        raised && styles.raised,
        open && styles.isOpen,
      )}
    >
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M2.5 4.5h13M4.8 9h8.4M7.5 13.5h3" strokeLinecap="round" />
        </svg>
        <span>تصفية النتائج</span>
        {activeCount > 0 ? (
          <span className={cn(styles.badge, "mono")}>{activeCount}</span>
        ) : null}
        <svg
          className={styles.toggleChevron}
          width="13"
          height="13"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path
            d="m2.5 4.5 3.5 3.5 3.5-3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={styles.bar}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {children}
      </div>
    </div>
  );
}

export interface ActivePill {
  key: string;
  label: string;
}

/** سطر النتائج: العدّاد ووسوم الفلاتر المفعّلة القابلة للإزالة. */
export function ResultRow({
  children,
  pills,
  onRemove,
}: {
  children: React.ReactNode;
  pills: ActivePill[];
  onRemove: (key: string) => void;
}) {
  return (
    <div className={styles.row}>
      <p className={styles.count}>{children}</p>
      <div className={styles.pills}>
        {pills.map((p) => (
          <span key={p.key} className={styles.pill}>
            {p.label}
            <button
              type="button"
              aria-label={`إزالة ${p.label}`}
              onClick={() => onRemove(p.key)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
