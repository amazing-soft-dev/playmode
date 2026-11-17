"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button, Checkbox, Field, Input, Select } from "@/components/ui";
import { COUNTRIES, login } from "@/content/auth";
import { browserRepos } from "@/lib/repos";
import { AgeGateError } from "@/lib/repos/mock/accounts";

import { announceSessionChange } from "./useProfile";

type Refusal = keyof typeof login.refused;

/**
 * Sign-in form with the neutral age gate from plan section 12: the year of birth is a plain
 * list with no hint about which answers unlock more, and the first answer is remembered.
 */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [refusal, setRefusal] = useState<Refusal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const year = new Date().getUTCFullYear();
  const years = Array.from({ length: 100 }, (_, i) => year - i);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      await browserRepos().auth.signIn({
        email: String(data.get("email")),
        displayName: String(data.get("displayName") ?? ""),
        birthYear: Number(data.get("birthYear")),
        country: String(data.get("country")),
      });
      announceSessionChange();
      const next = params.get("next");
      router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/account");
    } catch (e) {
      if (e instanceof AgeGateError) setRefusal(e.reason);
      else setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  if (refusal) {
    const copy = login.refused[refusal];
    return (
      <div role="status" className="flex flex-col gap-6 border border-line p-8">
        <h2 className="type-h3">{copy.title}</h2>
        <p className="type-body text-fog">{copy.text}</p>
        <div className="flex flex-wrap gap-4">
          <Button href="/daily">Play today&apos;s challenge</Button>
          <Button href="/gallery" variant="secondary">
            Browse the gallery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate={false}>
      <Field label={login.emailLabel}>
        {({ id, describedBy }) => <Input id={id} aria-describedby={describedBy} name="email" type="email" autoComplete="email" required />}
      </Field>
      <Field label={login.nameLabel} hint={login.nameHint}>
        {({ id, describedBy }) => (
          <Input id={id} aria-describedby={describedBy} name="displayName" maxLength={24} autoComplete="nickname" required />
        )}
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={login.yearLabel}>
          {({ id }) => (
            <Select id={id} name="birthYear" required defaultValue="">
              <option value="" disabled>
                Select
              </option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label={login.countryLabel}>
          {({ id }) => (
            <Select id={id} name="country" required defaultValue="">
              <option value="" disabled>
                Select
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Checkbox name="terms" required label={login.termsLabel} />
      {error && (
        <p role="alert" className="type-small text-danger">
          {error}
        </p>
      )}
      <Button type="submit" variant="solid" disabled={pending}>
        {pending ? "Signing in…" : login.submit}
      </Button>
      <p className="type-small text-ash">{login.mockNote}</p>
    </form>
  );
}
