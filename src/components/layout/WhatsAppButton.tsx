import { site } from "@/data/site";

/** زر تواصل عائم ثابت في كل الصفحات. الرقم تجريبي في هذه المرحلة. */
export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className={
        "fixed bottom-[22px] end-[22px] z-[70] grid h-[52px] w-[52px] place-items-center " +
        "rounded-full bg-[#1FAF54] text-white no-underline " +
        "shadow-[0_14px_30px_-12px_rgba(31,175,84,0.7)] " +
        "transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 " +
        "max-[1000px]:bottom-4 max-[1000px]:end-4 max-[1000px]:h-[46px] max-[1000px]:w-[46px]"
      }
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6a9.4 9.4 0 0 0 3.7 3.3c1.7.7 1.9.5 2.3.5.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.1-.4-.2Z" />
      </svg>
    </a>
  );
}
