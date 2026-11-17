"use client";

import { type FormEvent, useState } from "react";

import { Button, Field, Honeypot, Input, Select, Textarea } from "@/components/ui";

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

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

/**
 * Shared contact-style form: name, email, topic and message, plus a honeypot for bots. It posts
 * JSON to a route handler and shows sending, success and error states. Error copy explains what
 * to do next rather than showing raw codes.
 */
export function InquiryForm({ endpoint, topics, submitLabel = "Send message", successMessage = "Thanks! We'll reply by email within two working days." }: InquiryFormProps) {
  const [state, setState] = useState<State>({ kind: "idle" });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    setState({ kind: "sending" });
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        form.reset();
        setState({ kind: "sent" });
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setState({ kind: "error", message: data.error ?? "Something went wrong. Please try again in a moment." });
    } catch {
      setState({ kind: "error", message: "We couldn't reach the server. Check your connection and try again." });
    }
  };

  if (state.kind === "sent") {
    return (
      <p role="status" className="type-body border border-accent bg-accent-soft p-6 text-paper">
        {successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-6 md:grid-cols-2">
      <Honeypot />
      <Field label="Name">{({ id }) => <Input id={id} name="name" required maxLength={80} autoComplete="name" />}</Field>
      <Field label="Email">{({ id }) => <Input id={id} name="email" type="email" required maxLength={120} autoComplete="email" />}</Field>
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
      </div>
    </form>
  );
}
