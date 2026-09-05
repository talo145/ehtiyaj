"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PasswordField, RememberRow, TextField, fieldStyles } from "./fields";

interface LoginFormProps {
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
}

export function LoginForm({
  emailLabel,
  emailPlaceholder,
  submitLabel,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        // لا خادم بعد؛ يُستبدل هذا بنداء المصادقة عند الربط
        e.preventDefault();
      }}
    >
      <TextField
        label={emailLabel}
        type="email"
        autoComplete="email"
        placeholder={emailPlaceholder}
        ltr
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordField
        label="كلمة المرور"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <RememberRow />

      <Button
        type="submit"
        variant="cta"
        withArrow
        className={fieldStyles.submit}
      >
        {submitLabel}
      </Button>
    </form>
  );
}
