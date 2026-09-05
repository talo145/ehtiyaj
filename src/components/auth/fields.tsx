"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./fields.module.css";

const EyeIcon = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <path d="M1.8 10S4.9 4.6 10 4.6 18.2 10 18.2 10 15.1 15.4 10 15.4 1.8 10 1.8 10Z" />
    <circle cx="10" cy="10" r="2.6" />
  </svg>
);

export type FieldTone = "hint" | "err" | "ok";

interface TextFieldProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "id" | "className"
> {
  label: string;
  message?: string;
  tone?: FieldTone;
  /** يقلب اتجاه الحقل للاتيني — البريد والأرقام. */
  ltr?: boolean;
  state?: "bad" | "good";
}

export function TextField({
  label,
  message,
  tone = "hint",
  ltr = false,
  state,
  ...rest
}: TextFieldProps) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={cn(styles.input, ltr && styles.ltr, state && styles[state])}
        aria-invalid={state === "bad" || undefined}
        {...rest}
      />
      {message ? <p className={styles[tone]}>{message}</p> : null}
    </div>
  );
}

interface PasswordFieldProps extends Omit<TextFieldProps, "type"> {
  /** يعرض مقياس القوة — في صفحات إنشاء الحساب فقط. */
  strength?: number;
}

export function PasswordField({
  label,
  message,
  tone = "hint",
  state,
  strength,
  ...rest
}: PasswordFieldProps) {
  const id = useId();
  const [shown, setShown] = useState(false);

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.passWrap}>
        <input
          id={id}
          type={shown ? "text" : "password"}
          className={cn(styles.input, state && styles[state])}
          aria-invalid={state === "bad" || undefined}
          {...rest}
        />
        <button
          type="button"
          className={styles.eye}
          aria-label={shown ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          onClick={() => setShown((v) => !v)}
        >
          {EyeIcon}
        </button>
      </div>
      {strength !== undefined ? (
        <div
          className={cn(
            styles.meter,
            strength > 0 && styles[`s${strength}` as "s1"],
          )}
        >
          <i />
          <i />
          <i />
          <i />
        </div>
      ) : null}
      {message ? <p className={styles[tone]}>{message}</p> : null}
    </div>
  );
}

export function RememberRow({ forgotHref = "#" }: { forgotHref?: string }) {
  return (
    <div className={styles.row}>
      <label className={styles.remember}>
        <input type="checkbox" /> تذكّرني
      </label>
      <a href={forgotHref}>نسيت كلمة المرور؟</a>
    </div>
  );
}

export const fieldStyles = styles;
