import Link from "next/link";
import { needCategories } from "@/data/categories";
import { formatNumber } from "@/lib/needs";
import type { Association } from "@/types";
import styles from "./AssociationCard.module.css";

export function AssociationCard({
  association: a,
}: {
  association: Association;
}) {
  return (
    <article className={styles.card}>
      <span className={styles.logo} aria-hidden="true">
        {a.initial}
      </span>
      <b className={styles.name}>{a.name}</b>
      <span className={styles.place}>{a.place}</span>
      <p className={styles.scope}>{a.scope}</p>

      <div className={styles.tags}>
        {a.categories.map((c) => (
          <span key={c} className={styles.tag}>
            {needCategories[c]}
          </span>
        ))}
      </div>

      <div className={styles.stats}>
        <div>
          <b className="tabular">{formatNumber(a.initiatives)}</b>
          <span>مبادرة</span>
        </div>
        <div>
          <b className="tabular">{formatNumber(a.needs)}</b>
          <span>احتياج</span>
        </div>
      </div>

      <Link className={styles.go} href={`/associations/${a.id}`}>
        عرض الجمعية
        <span className="arrow" aria-hidden="true">
          ←
        </span>
      </Link>
    </article>
  );
}
