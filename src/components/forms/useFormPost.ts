"use client";

import { type FormEvent, useState } from "react";

export type FormState = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string } | { kind: "static" };

/** True in the static export, which has no /api routes. */
export const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/**
 * Submits a form as JSON to a route handler and tracks sending, success and error states. In the
 * static export there is no server, so it reports a "static" state instead of failing silently.
 */
export function useFormPost(endpoint: string) {
  const [state, setState] = useState<FormState>({ kind: "idle" });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (IS_STATIC_EXPORT) return setState({ kind: "static" });
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    setState({ kind: "sending" });
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
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

  return { state, onSubmit, reset: () => setState({ kind: "idle" }) };
}

export const STATIC_FORM_MESSAGE = "This preview is a static build without a server, so forms can't send. They work on the live site.";
