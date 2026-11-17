"use client";

import { Button, Checkbox, Field, Honeypot, Input } from "@/components/ui";

import { STATIC_FORM_MESSAGE, useFormPost } from "./useFormPost";

/** Closed-beta waitlist (plan section 18, phase 4), adults only, posting to /api/waitlist. */
export function WaitlistForm() {
  const { state, onSubmit } = useFormPost("/api/waitlist");
  if (state.kind === "sent") {
    return (
      <p role="status" className="type-body border border-accent bg-accent-soft p-5 text-paper">
        Thanks! We&apos;ll email you when a beta spot opens.
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} className="relative grid gap-5 md:grid-cols-2">
      <Honeypot />
      <Field label="Email">{({ id }) => <Input id={id} name="email" type="email" required autoComplete="email" />}</Field>
      <Field label="What would you build? (optional)">{({ id }) => <Input id={id} name="interest" maxLength={300} />}</Field>
      <Checkbox name="adult" required label="I'm 18 or older." className="md:col-span-2" />
      <div className="flex flex-wrap items-center gap-5 md:col-span-2">
        <Button type="submit" variant="secondary" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Joining…" : "Join the beta waitlist"}
        </Button>
        {state.kind === "error" && (
          <p role="alert" className="type-small text-danger">
            {state.message}
          </p>
        )}
        {state.kind === "static" && <p className="type-small text-fog">{STATIC_FORM_MESSAGE}</p>}
      </div>
    </form>
  );
}
