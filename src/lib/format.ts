/** تنسيق التواريخ والأرقام بالعربية.
 *  التواريخ تصل من الخادم نصوصًا ISO وتُعرض هجريًا (أم القرى). */

const hijriDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-latn", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const hijriDateTime = new Intl.DateTimeFormat(
  "ar-SA-u-ca-islamic-umalqura-nu-latn",
  {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  },
);

export function formatHijri(iso: string): string {
  return hijriDate.format(new Date(iso));
}

export function formatHijriTime(iso: string): string {
  return hijriDateTime.format(new Date(iso));
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

const relative = new Intl.RelativeTimeFormat("ar", { numeric: "auto" });

/** «قبل ساعتين»، «قبل 4 أيام» — للإشعارات. */
export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "الآن";

  for (const [unit, ms] of UNITS) {
    if (diff >= ms) return relative.format(-Math.floor(diff / ms), unit);
  }
  return "الآن";
}
