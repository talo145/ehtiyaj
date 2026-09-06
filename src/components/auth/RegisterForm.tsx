"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { registerBeneficiary } from "@/server/actions/auth";
import { DocumentConsent } from "./DocumentConsent";
import { PasswordField, TextField, fieldStyles } from "./fields";
import type { LegalDocument } from "@/data/legal";
import styles from "./fields.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** ثمانية أحرف على الأقل مع رقم وحرف — عربي أو لاتيني. نفس شرط الخادم. */
function validPassword(v: string) {
  return v.length >= 8 && /[0-9]/.test(v) && /[a-zA-Z؀-ۿ]/.test(v);
}

function strengthOf(v: string) {
  if (!v) return 0;
  let s = 0;
  if (v.length >= 8) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[a-zA-Z؀-ۿ]/.test(v)) s++;
  if (v.length >= 12 || /[^a-zA-Z0-9؀-ۿ]/.test(v)) s++;
  return s;
}

export interface ExtraField {
  key: string;
  label: string;
  placeholder: string;
  hint?: string;
}

interface RegisterFormProps {
  /** حقول تسبق البريد — اسم الفرد، أو اسم الكيان ومسؤول الحساب. */
  fields: ExtraField[];
  emailLabel: string;
  emailPlaceholder: string;
  emailHint: string;
  documents: LegalDocument[];
  submitLabel: string;
  /** حساب الجهة لم يُربط بالخادم بعد — نموذجه يبقى للعرض. */
  connected?: boolean;
}

export function RegisterForm({
  fields,
  emailLabel,
  emailPlaceholder,
  emailHint,
  documents,
  submitLabel,
  connected = false,
}: RegisterFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const emailOk = EMAIL.test(email.trim());
  const passOk = validPassword(password);
  const matchOk = confirm.length > 0 && confirm === password;
  const fieldsOk = fields.every((f) => (values[f.key] ?? "").trim().length > 1);
  const docsOk = documents.every((d) => agreed.includes(d.id));
  const ready = fieldsOk && emailOk && passOk && matchOk && docsOk;

  const strength = useMemo(() => strengthOf(password), [password]);

  const passMessage = !password
    ? "ثمانية أحرف على الأقل، وتتضمّن رقمًا وحرفًا."
    : passOk
      ? strength >= 4
        ? "كلمة مرور قوية."
        : "كلمة مرور مقبولة."
      : "كلمة المرور لا تحقّق الشرط: ثمانية أحرف على الأقل مع رقم وحرف.";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);

        if (!connected) {
          setError("حساب الجهة لم يُربط بالخادم بعد.");
          return;
        }

        startTransition(async () => {
          // النجاح يعيد التوجيه من الخادم؛ ما يعود هنا خطأ فقط.
          const res = await registerBeneficiary({
            name: (values.name ?? "").trim(),
            email: email.trim(),
            password,
            confirm,
            documents: agreed,
          });
          if (res && !res.ok) setError(res.error);
        });
      }}
    >
      {fields.map((f) => (
        <TextField
          key={f.key}
          label={f.label}
          placeholder={f.placeholder}
          message={f.hint}
          value={values[f.key] ?? ""}
          onChange={(e) =>
            setValues((v) => ({ ...v, [f.key]: e.target.value }))
          }
        />
      ))}

      <TextField
        label={emailLabel}
        type="email"
        autoComplete="email"
        placeholder={emailPlaceholder}
        message={emailHint}
        ltr
        state={email ? (emailOk ? "good" : "bad") : undefined}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordField
        label="كلمة المرور"
        autoComplete="new-password"
        placeholder="8 أحرف على الأقل"
        strength={strength}
        message={passMessage}
        tone={!password ? "hint" : passOk ? "ok" : "err"}
        state={password ? (passOk ? "good" : "bad") : undefined}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <PasswordField
        label="تأكيد كلمة المرور"
        autoComplete="new-password"
        placeholder="أعد كتابة كلمة المرور"
        message={
          confirm
            ? matchOk
              ? "متطابقتان."
              : "كلمتا المرور غير متطابقتين."
            : undefined
        }
        tone={matchOk ? "ok" : "err"}
        state={confirm ? (matchOk ? "good" : "bad") : undefined}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <div className={styles.field} style={{ marginTop: 22 }}>
        <label>المستندات المطلوب الموافقة عليها</label>
        <DocumentConsent documents={documents} onChange={setAgreed} />
      </div>

      {error ? (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="cta"
        withArrow
        loading={pending}
        disabled={!ready || pending}
        className={fieldStyles.submit}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
