"use client";

import { cn } from "@/lib/cn";
import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

/** لا يظهر إن كانت النتائج صفحة واحدة. */
export function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages <= 1) return null;

  return (
    <nav className={styles.pager} aria-label="التنقل بين الصفحات">
      <button
        type="button"
        aria-label="الصفحة السابقة"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ›
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? "page" : undefined}
          className={cn(p === page && styles.current)}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="الصفحة التالية"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
      >
        ‹
      </button>
    </nav>
  );
}
