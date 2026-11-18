"use client";

import { ArrowIcon, Honeypot } from "@/components/ui";

import { STATIC_FORM_MESSAGE, useFormPost } from "./useFormPost";

/** Footer sign-up for devlog updates, posting to /api/newsletter. */
export function NewsletterForm() {
  const { state, onSubmit } = useFormPost("/api/newsletter");
  if (state.kind === "sent") {
    return (
      <p role="status" className="type-small text-accent">
        You&apos;re on the list. Watch your inbox for the next devlog.
      </p>
    );
  }
  return (
    <form onSubmit={onSubmit} className="relative flex w-full max-w-[420px] flex-col gap-2">
      <Honeypot />
      <label htmlFor="newsletter-email" className="type-label text-fog">
        Devlog updates by email
      </label>
      <div className="flex border-b border-paper/30 focus-within:border-accent">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11 min-w-0 flex-1 bg-transparent type-body text-paper placeholder:text-ash focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={state.kind === "sending"}
          className="px-2 transition-colors hover:text-accent disabled:opacity-50"
        >
          <ArrowIcon className="size-5" />
        </button>
      </div>
      {state.kind === "error" && (
        <p role="alert" className="type-small text-danger">
          {state.message}
        </p>
      )}
      {state.kind === "static" && <p className="type-small text-fog">{STATIC_FORM_MESSAGE}</p>}
    </form>
  );
}
