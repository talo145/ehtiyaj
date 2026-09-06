"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { login } from "@/server/actions/auth";
import { PasswordField, RememberRow, TextField, fieldStyles } from "./fields";

interface LoginFormProps {
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  /** دخول الجهة لم يُربط بالخادم بعد — نموذجه يبقى للعرض. */
  connected?: boolean;
}

export function LoginForm({
  emailLabel,
  emailPlaceholder,
  submitLabel,
  connected = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);

        if (!connected) {
          setError("دخول الجهات لم يُربط بالخادم بعد.");
          return;
        }

        startTransition(async () => {
          // النجاح يعيد التوجيه من الخادم؛ ما يعود هنا خطأ فقط.
          const res = await login({ email, password });
          if (res && !res.ok) setError(res.error);
        });
      }}
    >
      <TextField
        label={emailLabel}
        type="email"
        autoComplete="email"
        placeholder={emailPlaceholder}
        ltr
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordField
        label="كلمة المرور"
        autoComplete="current-password"
        placeholder="••••••••"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <RememberRow />

      {error ? (
        <p className={fieldStyles.formError} role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="cta"
        withArrow
        loading={pending}
        disabled={pending}
        className={fieldStyles.submit}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
