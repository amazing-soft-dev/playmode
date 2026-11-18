import { type ComponentPropsWithoutRef, type ReactNode, useId } from "react";

import { cn } from "@/lib/cn";

const control =
  "type-body w-full border border-line bg-ink px-4 text-paper placeholder:text-ash transition-colors duration-200 " +
  "hover:border-ash focus:border-accent focus:outline-none aria-invalid:border-danger disabled:opacity-50";

interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

/** Label, control, hint and error, wired with ids so screen readers announce them together. */
export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="type-label text-fog">
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="type-small text-ash">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="type-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(control, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn(control, "min-h-32 resize-y py-3", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentPropsWithoutRef<"select">) {
  return (
    <select className={cn(control, "h-12 appearance-none bg-[length:16px] pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ label, className, ...props }: ComponentPropsWithoutRef<"input"> & { label: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 type-small text-fog", className)}>
      <input type="checkbox" className="mt-1 size-4 shrink-0 accent-accent" {...props} />
      <span>{label}</span>
    </label>
  );
}

/** Hidden field that only bots fill in; the API rejects submissions where it has a value. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
