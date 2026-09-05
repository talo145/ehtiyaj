"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { DocumentConsent } from "./DocumentConsent";
import { PasswordField, TextField, fieldStyles } from "./fields";
import type { LegalDocument } from "@/data/legal";
import styles from "./fields.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** ثمانية أحرف على الأقل مع رقم وحرف — عربي أو لاتيني. */
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
}

export function RegisterForm({
  fields,
  emailLabel,
  emailPlaceholder,
  emailHint,
  documents,
  submitLabel,
}: RegisterFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState<string[]>([]);

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
        // لا خادم بعد؛ يُستبدل هذا بنداء إنشاء الحساب عند الربط
        e.preventDefault();
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

      <Button
        type="submit"
        variant="cta"
        withArrow
        disabled={!ready}
        className={fieldStyles.submit}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
