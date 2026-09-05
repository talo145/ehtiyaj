import { needStages } from "@/data/account-demo";
import { needCategoryOptions } from "@/data/need-categories";
import { cn } from "@/lib/cn";
import type {
  BeneficiaryNeed,
  BeneficiaryNotification,
  NeedRecord,
  NeedStatus,
} from "@/types";
import { BellIcon } from "./icons";
import styles from "./AccountUi.module.css";

/** نبرة الوسم: البرتقالي للمراجعة، الأخضر لما هو حيّ، الرمادي لما أُغلق. */
const tone: Record<NeedStatus, string> = {
  new: styles.review,
  review: styles.review,
  processing: styles.live,
  responded: styles.live,
  withdrawn: styles.done,
  closed: styles.done,
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: NeedStatus;
  label: string;
  className?: string;
}) {
  return (
    <span className={cn(styles.badge, tone[status], className)}>
      <i aria-hidden="true" />
      {label}
    </span>
  );
}

/** المسار الأربعي كما يراه المستفيد: ما مضى، وأين هو الآن، وما لم يبدأ. */
export function NeedTimeline({ need }: { need: BeneficiaryNeed }) {
  const reached = needStages.findIndex((s) => s.status === need.status);

  return (
    <div className={styles.track}>
      {needStages.map((stage, i) => {
        const event = need.events.find((e) => e.status === stage.status);
        const state =
          i < reached ? styles.passed : i === reached ? styles.current : styles.pending;

        return (
          <div key={stage.status} className={cn(styles.step, state)}>
            <span className={styles.knob} aria-hidden="true" />
            <div>
              <b>{stage.title}</b>
              <span className={styles.when}>{event ? event.at : "لم تبدأ بعد"}</span>
              {event?.note ? <span className={styles.note}>{event.note}</span> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** تظهر بعد بدء المعالجة فقط — قبلها لا جهة بعد. */
export function AssociationCard({ need }: { need: BeneficiaryNeed }) {
  if (!need.association) return null;

  return (
    <div className={styles.card}>
      <h3>الجمعية التي تعالج احتياجك</h3>
      <p className={styles.sub}>
        تظهر بعد بدء المعالجة، وتتواصل معك على رقم جوالك المسجّل.
      </p>
      <div className={styles.org}>
        <span className={styles.orgMark} aria-hidden="true">
          {need.association.initial}
        </span>
        <div>
          <b>{need.association.name}</b>
          <span>{need.association.city}</span>
        </div>
      </div>
    </div>
  );
}

export function NeedFacts({ need }: { need: BeneficiaryNeed }) {
  const rows: [string, string][] = [
    ["رقم الاحتياج", need.id],
    ["التصنيف", needCategoryOptions[need.category]?.name ?? "—"],
    ["التصنيف الفرعي", need.subcategory],
    ["الموقع", `${need.city} · ${need.region}`],
    ["مدى الإلحاح", need.urgency],
    ["تاريخ الإرسال", need.submittedAt],
    ["الأولوية", need.priority ?? "قيد التحديد"],
  ];

  return (
    <dl className={styles.kv}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd className={k === "رقم الاحتياج" ? "mono" : undefined}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HistoryRows({ items }: { items: NeedRecord[] }) {
  return (
    <div className={styles.stack}>
      {items.map((h) => (
        <div key={h.id} className={styles.row}>
          <div>
            <b>{h.title}</b>
            <div className={styles.meta}>
              <span>{h.category}</span>
              <span>{h.closedAt}</span>
              {h.association ? <span>{h.association}</span> : null}
              <span className="mono">{h.id}</span>
            </div>
          </div>
          <StatusBadge
            status={h.status}
            label={h.statusLabel}
            className={styles.rowBadge}
          />
        </div>
      ))}
    </div>
  );
}

export function NotificationRows({
  items,
}: {
  items: BeneficiaryNotification[];
}) {
  if (!items.length) {
    return <p className={styles.sub}>لا إشعارات.</p>;
  }

  return (
    <div className={styles.stack}>
      {items.map((n) => (
        <div key={n.id} className={cn(styles["note-i"], n.unread && styles.unread)}>
          <span className={styles.noteIcon} aria-hidden="true">
            <BellIcon size={16} />
          </span>
          <div>
            <b>{n.title}</b>
            <p>{n.body}</p>
            <span className={styles.when}>{n.at}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export { styles as ui };
