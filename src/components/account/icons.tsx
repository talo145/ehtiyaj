/** أيقونات حساب المستفيد — خطّية بمقاس موحّد، تتبع لون النص. */

type P = { size?: number };

const box = (size = 17) => ({
  width: size,
  height: size,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  "aria-hidden": true as const,
});

export function HomeIcon({ size }: P) {
  return (
    <svg {...box(size)}>
      <path
        d="M3.5 8.4 10 3.5l6.5 4.9V16a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V8.4Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DocIcon({ size }: P) {
  return (
    <svg {...box(size)}>
      <rect x="4.5" y="3" width="11" height="14" rx="2" />
      <path d="M7.5 7.5h5M7.5 10.5h5M7.5 13.5h3" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ size }: P) {
  return (
    <svg {...box(size)}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4.3l2.6 1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BellIcon({ size }: P) {
  return (
    <svg {...box(size)}>
      <path
        d="M5.5 8.4a4.5 4.5 0 0 1 9 0c0 4 1.6 5.2 1.6 5.2H3.9s1.6-1.2 1.6-5.2Z"
        strokeLinejoin="round"
      />
      <path d="M8.4 16.2a1.9 1.9 0 0 0 3.2 0" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon({ size }: P) {
  return (
    <svg {...box(size)}>
      <circle cx="10" cy="7" r="3" />
      <path d="M4 17c.5-3 3-4.6 6-4.6s5.5 1.6 6 4.6" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon({ size }: P) {
  return (
    <svg {...box(size)}>
      <path d="M10 2.5 3.8 5v4.6c0 3.6 2.5 6.9 6.2 7.9 3.7-1 6.2-4.3 6.2-7.9V5L10 2.5Z" />
    </svg>
  );
}

export function PlusIcon({ size = 18 }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronIcon({ size = 15 }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path d="M12 4.5 6.5 10 12 15.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SignOutIcon({ size }: P) {
  return (
    <svg {...box(size)}>
      <path
        d="M12.5 6.2V4.5a1.6 1.6 0 0 0-1.6-1.6H5.1A1.6 1.6 0 0 0 3.5 4.5v11a1.6 1.6 0 0 0 1.6 1.6h5.8a1.6 1.6 0 0 0 1.6-1.6v-1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8.4 10h8.1m0 0-2.4-2.4M16.5 10l-2.4 2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon({ size = 22 }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <rect x="5" y="10.4" width="14" height="9.4" rx="2.2" />
      <path d="M8.4 10.4V7.8a3.6 3.6 0 0 1 7.2 0v2.6" strokeLinecap="round" />
    </svg>
  );
}

export function InfoIcon({ size = 22 }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.4M12 7.8v.1" strokeLinecap="round" />
    </svg>
  );
}

/** أيقونات تصنيفات الاحتياج الستة في الاستبانة. */
export const categoryIcons = {
  device: (
    <svg {...box(18)} viewBox="0 0 22 22" strokeWidth={1.5}>
      <rect x="3" y="5" width="16" height="10" rx="2" />
      <path d="M7 18h8" strokeLinecap="round" />
    </svg>
  ),
  pill: (
    <svg {...box(18)} viewBox="0 0 22 22" strokeWidth={1.5}>
      <rect
        x="3.2"
        y="7.6"
        width="15.6"
        height="6.8"
        rx="3.4"
        transform="rotate(-40 11 11)"
      />
      <path d="M8.4 8.4 13.6 13.6" strokeLinecap="round" />
    </svg>
  ),
  search: (
    <svg {...box(18)} viewBox="0 0 22 22" strokeWidth={1.5}>
      <circle cx="9.6" cy="9.6" r="5.4" />
      <path d="M13.6 13.6 18 18" strokeLinecap="round" />
    </svg>
  ),
  home: (
    <svg {...box(18)} viewBox="0 0 22 22" strokeWidth={1.5}>
      <path
        d="M4 10.2 11 4.6l7 5.6V17a1.2 1.2 0 0 1-1.2 1.2H5.2A1.2 1.2 0 0 1 4 17Z"
        strokeLinejoin="round"
      />
      <path
        d="M11 15.4s-2.6-1.6-2.6-3.1a1.4 1.4 0 0 1 2.6-.7 1.4 1.4 0 0 1 2.6.7c0 1.5-2.6 3.1-2.6 3.1Z"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mind: (
    <svg {...box(18)} viewBox="0 0 22 22" strokeWidth={1.5}>
      <path
        d="M14.6 17.4v-2.2c2-.9 3.4-2.9 3.4-5.2A6.2 6.2 0 0 0 5.7 8.6c-.1.9-.6 1.6-1.2 2.2l-.6.6c-.3.3-.2.9.3 1l1.4.4v2.1c0 .9.7 1.6 1.6 1.6h1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  speak: (
    <svg {...box(18)} viewBox="0 0 22 22" strokeWidth={1.5}>
      <path
        d="M4 8.6a2 2 0 0 1 2-2h9.4a2 2 0 0 1 2 2v4.6a2 2 0 0 1-2 2H9.4L5.6 18v-2.8H6a2 2 0 0 1-2-2Z"
        strokeLinejoin="round"
      />
    </svg>
  ),
} as const;

/** علامة احتياج داخل الحساب: الرمز فقط، بلا رابط للموقع العام. */
export function AccountMark({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden="true">
      <circle
        cx="13"
        cy="13"
        r="11.2"
        fill="none"
        stroke="#16B3A0"
        strokeWidth="1.4"
        opacity=".4"
      />
      <circle
        cx="13"
        cy="13"
        r="6.4"
        fill="none"
        stroke="#16B3A0"
        strokeWidth="1.4"
        opacity=".72"
      />
      <circle cx="13" cy="13" r="2.6" fill="#16B3A0" />
    </svg>
  );
}
