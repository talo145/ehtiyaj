import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "cta" | "outline" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold no-underline " +
  "transition-[transform,background-color,color,border-color] duration-200 " +
  "border border-transparent cursor-pointer " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:-translate-y-px",
  cta: "bg-accent text-on-accent hover:-translate-y-0.5",
  outline:
    "text-ink border-[color:var(--line)] hover:border-accent hover:text-accent",
  ghost: "text-ink border-[color:var(--line)] hover:border-muted",
  text:
    "text-muted !border-0 border-b !border-b-[color:var(--line)] !rounded-none !px-0 !py-0 pb-0.5 " +
    "hover:text-ink hover:!border-b-accent",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-[0.82rem] px-3.5 py-2 rounded-lg",
  md: "text-[0.88rem] px-[17px] py-[9px] rounded-[9px]",
  lg: "text-base px-[26px] py-[15px] rounded-[11px]",
};

interface Shared {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** سهم يشير لاتجاه القراءة، يُعرض بعد النص. */
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

type LinkButton = Shared &
  Omit<React.ComponentPropsWithoutRef<"a">, keyof Shared> & { href: string };

type PlainButton = Shared &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof Shared> & {
    href?: never;
    loading?: boolean;
  };

export function Button(props: LinkButton | PlainButton) {
  const {
    variant = "primary",
    size = "md",
    withArrow,
    className,
    children,
  } = props;
  const cls = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {children}
      {withArrow ? (
        <span className="arrow" aria-hidden="true">
          ←
        </span>
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    const {
      href,
      variant: _v,
      size: _s,
      withArrow: _a,
      className: _c,
      children: _ch,
      ...rest
    } = props as LinkButton;
    return (
      <Link href={href} className={cls} {...rest}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    withArrow: _a,
    className: _c,
    children: _ch,
    loading = false,
    type = "button",
    disabled,
    ...rest
  } = props as PlainButton;

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? "جارٍ التنفيذ…" : content}
    </button>
  );
}
