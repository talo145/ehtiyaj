import Link from "next/link";
import { Badge, toneOfStatus } from "@/components/ui/Badge";
import { associationsById } from "@/data/associations";
import { needCategories } from "@/data/categories";
import type { Initiative } from "@/types";
import styles from "./InitiativeCard.module.css";

export function InitiativeCard({ initiative: i }: { initiative: Initiative }) {
  const org = associationsById.get(i.associationId);

  return (
    <article className={styles.card}>
      <Badge tone={toneOfStatus[i.status]}>{i.statusLabel}</Badge>
      <h3>{i.title}</h3>
      <span className={styles.org}>{org?.name}</span>

      <div className={styles.meta}>
        <span>{i.city}</span>
        <span>{needCategories[i.category]}</span>
        <span>{i.startedAt}</span>
      </div>

      {i.status === "active" ? (
        <div className={styles.progress}>
          <b>
            الإنجاز <span className="mono">{i.progress}%</span>
          </b>
          <i>
            <em style={{ width: `${i.progress}%` }} />
          </i>
        </div>
      ) : null}

      <div className={styles.foot}>
        <Link className={styles.go} href={`/initiatives/${i.id}`}>
          تفاصيل المبادرة
          <span className="arrow" aria-hidden="true">
            ←
          </span>
        </Link>
      </div>
    </article>
  );
}
