import { needStages, statusLabels } from "@/data/account-demo";
import {
  contactOptions,
  contactTimeOptions,
  labelOf,
  mobilityOptions,
  needCategoryOptions,
  recurrenceOptions,
  sinceOptions,
  urgencyOptions,
} from "@/data/need-categories";
import { formatHijri, formatHijriTime, formatRelative } from "@/lib/format";
import { cn } from "@/lib/cn";
import type {
  HistoryItemView,
  NeedView,
  NeedStatusValue,
  NotificationView,
} from "@/server/view-types";
import { BellIcon } from "./icons";
import styles from "./AccountUi.module.css";

/** نبرة الوسم: البرتقالي للمراجعة، الأخضر لما هو حيّ، الرمادي لما أُغلق. */
const tone: Record<NeedStatusValue, string> = {
  new: styles.review,
  review: styles.review,
  processing: styles.live,
  responded: styles.live,
  withdrawn: styles.done,
  closed: styles.done,
};

export function StatusBadge({
  status,
  className,
}: {
  status: NeedStatusValue;
  className?: string;
}) {
  return (
    <span className={cn(styles.badge, tone[status], className)}>
      <i aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}

/** المسار الأربعي كما يراه المستفيد: ما مضى، وأين هو الآن، وما لم يبدأ. */
export function NeedTimeline({ need }: { need: NeedView }) {
  const reached = needStages.findIndex((s) => s.status === need.status);

  return (
    <div className={styles.track}>
      {needStages.map((stage, i) => {
        const event = need.events.find((e) => e.status === stage.status);
        const state =
          i < reached
            ? styles.passed
            : i === reached
              ? styles.current
              : styles.pending;

        return (
          <div key={stage.status} className={cn(styles.step, state)}>
            <span className={styles.knob} aria-hidden="true" />
            <div>
              <b>{event?.title ?? stage.title}</b>
              <span className={styles.when}>
                {event ? formatHijriTime(event.at) : "لم تبدأ بعد"}
              </span>
              {event?.note ? (
                <span className={styles.note}>{event.note}</span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** تظهر بعد بدء المعالجة فقط — قبلها لا جهة بعد. */
export function AssociationCard({ need }: { need: NeedView }) {
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

const priorityLabels = {
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
} as const;

export function NeedFacts({ need }: { need: NeedView }) {
  const rows: [string, string][] = [
    ["رقم الاحتياج", need.reference],
    ["التصنيف", needCategoryOptions[need.categoryId]?.name ?? "—"],
    ["التصنيف الفرعي", need.subcategory],
    ["الموقع", `${need.city} · ${need.region}`],
    ["منذ متى", labelOf(sinceOptions, need.since)],
    ["طبيعة الحاجة", labelOf(recurrenceOptions, need.recurrence)],
    ["التنقّل", labelOf(mobilityOptions, need.mobility)],
    ["مدى الإلحاح", labelOf(urgencyOptions, need.urgency)],
    ["وسيلة التواصل", labelOf(contactOptions, need.contactMethod)],
    ["وقت التواصل", labelOf(contactTimeOptions, need.contactTime)],
    ["تاريخ الإرسال", formatHijri(need.submittedAt)],
    ["الأولوية", need.priority ? priorityLabels[need.priority] : "قيد التحديد"],
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

export function HistoryRows({ items }: { items: HistoryItemView[] }) {
  return (
    <div className={styles.stack}>
      {items.map((h) => (
        <div key={h.id} className={styles.row}>
          <div>
            <b>{h.title}</b>
            <div className={styles.meta}>
              <span>{needCategoryOptions[h.categoryId]?.name}</span>
              <span>{formatHijri(h.closedAt)}</span>
              {h.association ? <span>{h.association}</span> : null}
              <span className="mono">{h.reference}</span>
            </div>
          </div>
          <StatusBadge status={h.status} className={styles.rowBadge} />
        </div>
      ))}
    </div>
  );
}

export function NotificationRows({ items }: { items: NotificationView[] }) {
  if (!items.length) {
    return <p className={styles.sub}>لا إشعارات.</p>;
  }

  return (
    <div className={styles.stack}>
      {items.map((n) => (
        <div
          key={n.id}
          className={cn(styles["note-i"], n.unread && styles.unread)}
        >
          <span className={styles.noteIcon} aria-hidden="true">
            <BellIcon size={16} />
          </span>
          <div>
            <b>{n.title}</b>
            <p>{n.body}</p>
            <span className={styles.when}>{formatRelative(n.at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export { styles as ui };
