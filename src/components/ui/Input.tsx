"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

const field =
  "w-full rounded-[11px] border border-[color:var(--line)] bg-[rgba(234,242,245,0.04)] " +
  "px-4 py-3 text-[0.92rem] text-ink placeholder:text-dim " +
  "transition-[border-color,background-color] duration-200 " +
  "focus:border-accent focus:bg-[rgba(234,242,245,0.06)] focus:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-[invalid=true]:border-[#E3796B]";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.86rem] font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="m-0 text-[0.78rem] text-[#E3796B]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="m-0 text-[0.78rem] text-dim">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "id"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, ...rest }: InputProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        className={cn(field, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...rest}
      />
    </FieldShell>
  );
}

type SelectProps = Omit<React.ComponentPropsWithoutRef<"select">, "id"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Select({
  label,
  hint,
  error,
  className,
  children,
  ...rest
}: SelectProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        className={cn(field, "appearance-none", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}
