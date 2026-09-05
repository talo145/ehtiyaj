import styles from "./AssociationProfile.module.css";

const WhatsApp = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6a9.4 9.4 0 0 0 3.7 3.3c1.7.7 1.9.5 2.3.5.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.1-.4-.2Z" />
  </svg>
);

const Snapchat = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2.6c2.7 0 4.6 2 4.7 4.7 0 .8-.1 1.6-.1 2.3.4.2.8.2 1.2.1.6-.1 1.1.4 1 1-.1.5-.6.8-1.1 1-.5.2-1.1.3-1.2.7-.1.4.3 1 .7 1.6.7 1 1.7 2 3 2.4.4.1.6.5.5.9-.2.6-1.3.9-2.4 1.1-.3 0-.4.3-.5.6l-.1.6c-.1.4-.4.5-.8.4-.6-.1-1.3-.3-2.2-.1-.8.2-1.4.7-2.1 1.2-.6.4-1.3.4-1.9 0-.7-.5-1.3-1-2.1-1.2-.9-.2-1.6 0-2.2.1-.4.1-.7 0-.8-.4l-.1-.6c-.1-.3-.2-.6-.5-.6-1.1-.2-2.2-.5-2.4-1.1-.1-.4.1-.8.5-.9 1.3-.4 2.3-1.4 3-2.4.4-.6.8-1.2.7-1.6-.1-.4-.7-.5-1.2-.7-.5-.2-1-.5-1.1-1-.1-.6.4-1.1 1-1 .4.1.8.1 1.2-.1 0-.7-.1-1.5-.1-2.3.1-2.7 2-4.7 4.7-4.7Z" />
  </svg>
);

const XIcon = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12.2 2h2.1l-4.6 5.3L15 14h-4.2l-3.3-4.3L3.7 14H1.6l5-5.7L1 2h4.3l3 4 3.9-4Zm-.7 10.7h1.2L4.6 3.2H3.3l8.2 9.5Z" />
  </svg>
);

const YouTube = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10.2 15V9l5.2 3-5.2 3Z" />
  </svg>
);

const Website = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </svg>
);

const channels = [
  { label: "واتساب", icon: WhatsApp },
  { label: "سناب شات", icon: Snapchat },
  { label: "إكس", icon: XIcon },
  { label: "يوتيوب", icon: YouTube },
  { label: "الموقع الإلكتروني", icon: Website },
];

/** روابط تواصل الجهة. تُملأ من ملفها عند الربط؛ الروابط الآن معطّلة. */
export function ContactChannels() {
  return (
    <div className={styles.channels}>
      {channels.map((c) => (
        <a key={c.label} href="#" aria-label={c.label}>
          <i>{c.icon}</i>
          {c.label}
        </a>
      ))}
    </div>
  );
}
