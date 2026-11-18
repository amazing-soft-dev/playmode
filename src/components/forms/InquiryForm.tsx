"use client";

import { Button, Field, Honeypot, Input, Select, Textarea } from "@/components/ui";

import { STATIC_FORM_MESSAGE, useFormPost } from "./useFormPost";

export interface InquiryTopic {
  value: string;
  label: string;
}

interface InquiryFormProps {
  /** Route handler that receives the form, e.g. /api/contact. */
  endpoint: string;
  topics: InquiryTopic[];
  submitLabel?: string;
  successMessage?: string;
}

/**
 * Shared contact-style form: name, email, topic and message, plus a honeypot for bots. It posts
 * JSON to a route handler through useFormPost and shows sending, success, error and static-build
 * states. Error copy explains what to do next rather than showing raw codes.
 */
export function InquiryForm({
  endpoint,
  topics,
  submitLabel = "Send message",
  successMessage = "Thanks! We'll reply by email within two working days.",
}: InquiryFormProps) {
  const { state, onSubmit } = useFormPost(endpoint);

  if (state.kind === "sent") {
    return (
      <p role="status" className="border border-accent bg-accent-soft p-6 type-body text-paper">
        {successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-6 md:grid-cols-2">
      <Honeypot />
      <Field label="Name">
        {({ id }) => <Input id={id} name="name" required maxLength={80} autoComplete="name" />}
      </Field>
      <Field label="Email">
        {({ id }) => <Input id={id} name="email" type="email" required maxLength={120} autoComplete="email" />}
      </Field>
      <Field label="Topic" className="md:col-span-2">
        {({ id }) => (
          <Select id={id} name="topic" required defaultValue={topics[0]?.value}>
            {topics.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Message" className="md:col-span-2">
        {({ id }) => <Textarea id={id} name="message" required minLength={10} maxLength={2000} rows={6} />}
      </Field>
      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <Button type="submit" variant="solid" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending…" : submitLabel}
        </Button>
        {state.kind === "error" && (
          <p role="alert" className="type-small text-danger">
            {state.message}
          </p>
        )}
        {state.kind === "static" && (
          <p role="status" className="type-small text-fog">
            {STATIC_FORM_MESSAGE}
          </p>
        )}
      </div>
    </form>
  );
}
