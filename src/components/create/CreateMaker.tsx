"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import { useProfile } from "@/components/auth/useProfile";
import { GamePlayer } from "@/components/game/GamePlayer";
import { BracketLabel, Button } from "@/components/ui";
import { create } from "@/content/create";
import { POLICY } from "@/lib/domain/policy";
import { utcDateKey } from "@/lib/domain/time";
import type { TemplateId } from "@/lib/domain/types";
import { TEMPLATES, templateInfo } from "@/lib/fixtures/templates";
import { moderatePrompt } from "@/lib/moderation";

import { Workbench } from "./Workbench";
import { type Quota, buildQuota } from "@/lib/quota";
import { browserRepos } from "@/lib/repos";
import { cn } from "@/lib/cn";

type Choice = TemplateId | "freeform";
type Status = "idle" | "generating" | "ready";

export interface BuiltGame {
  html: string;
  prompt: string;
  template: TemplateId;
  model: string;
}

const isTemplate = (v: string | null): v is TemplateId => TEMPLATES.some((t) => t.id === v);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * The game maker (plan section 05, steps 1–3): pick a template, describe the game, generate.
 * Moderation runs first and never costs a build; a failed or timed-out build is not counted;
 * only one build runs at a time. Signed-out visitors can play the example game for any template.
 */
export function CreateMaker({ onBuilt }: { onBuilt?: (game: BuiltGame) => void }) {
  const params = useSearchParams();
  const { profile, ready } = useProfile();
  const promptId = useId();
  const initialTemplate = params.get("template");
  const [choice, setChoice] = useState<Choice>(isTemplate(initialTemplate) ? initialTemplate : "runner");
  const [prompt, setPrompt] = useState(() => (params.get("prompt") ?? "").slice(0, POLICY.promptMaxChars));
  const [status, setStatus] = useState<Status>("idle");
  const [stage, setStage] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [swaps, setSwaps] = useState<{ from: string; to: string }[]>([]);
  const [game, setGame] = useState<BuiltGame | null>(null);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const template: TemplateId = choice === "freeform" ? "runner" : choice;
  const info = templateInfo(template);

  const refreshQuota = useCallback(async () => {
    if (!profile) return setQuota(null);
    const usage = await browserRepos().usage.get(profile.id, utcDateKey());
    setQuota(buildQuota(profile.plan, usage));
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    let alive = true;
    void browserRepos()
      .usage.get(profile.id, utcDateKey())
      .then((usage) => alive && setQuota(buildQuota(profile.plan, usage)));
    return () => {
      alive = false;
    };
  }, [profile]);

  const generate = async () => {
    if (!profile || status === "generating" || (quota && !quota.canBuild)) return;
    setMessage(null);
    const checked = moderatePrompt(prompt);
    if (!checked.ok) return setMessage(checked.message);
    setSwaps(checked.replacements);
    setStatus("generating");
    setStage(0);
    const ticker = window.setInterval(() => setStage((s) => Math.min(s + 1, create.stages.length - 1)), 700);
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), POLICY.generationTimeoutMs),
      );
      const [result] = await Promise.all([
        Promise.race([browserRepos().ai.generate({ template, prompt: checked.prompt }), timeout]),
        wait(create.stages.length * 700),
      ]);
      // Only a finished build is counted.
      await browserRepos().usage.recordBuild(profile.id, utcDateKey());
      await refreshQuota();
      const built = { html: result.html, prompt: checked.prompt, template, model: result.model };
      setGame(built);
      setErrors([]);
      setStatus("ready");
      onBuilt?.(built);
    } catch {
      setMessage(create.failedNoCharge);
      setStatus(game ? "ready" : "idle");
    } finally {
      window.clearInterval(ticker);
    }
  };

  const nextHref = useMemo(() => {
    const q = new URLSearchParams({
      template: choice === "freeform" ? "runner" : choice,
      ...(prompt ? { prompt } : {}),
    });
    return `/login?next=${encodeURIComponent(`/create?${q}`)}`;
  }, [choice, prompt]);

  const limitReached = quota !== null && !quota.canBuild;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-[60px]">
        <div className="flex flex-col gap-8">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-4 type-label text-fog">{create.templateLabel}</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                ...TEMPLATES.map((t) => ({ id: t.id as Choice, label: t.genre })),
                { id: "freeform" as Choice, label: create.freeformLabel },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    "flex h-11 cursor-pointer items-center justify-center border type-label transition-colors duration-200",
                    choice === opt.id
                      ? "border-accent bg-accent text-accent-ink"
                      : "border-line text-fog hover:border-accent hover:text-accent",
                  )}
                >
                  <input
                    type="radio"
                    name="template"
                    value={opt.id}
                    checked={choice === opt.id}
                    onChange={() => setChoice(opt.id)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <p className="type-small text-ash">
              {choice === "freeform" ? create.freeformText : `${info.sampleTitle}: ${info.summary}`}
            </p>
          </fieldset>

          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between gap-4">
              <label htmlFor={promptId} className="type-label text-fog">
                {create.promptLabel}
              </label>
              <button
                type="button"
                onClick={() => setPrompt(info.examplePrompt)}
                className="type-label text-ash transition-colors hover:text-accent"
              >
                {create.useExample}
              </button>
            </div>
            <textarea
              id={promptId}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, POLICY.promptMaxChars))}
              maxLength={POLICY.promptMaxChars}
              rows={5}
              placeholder={info.examplePrompt}
              className="min-h-36 resize-y border border-line bg-ink px-4 py-3 type-body text-paper placeholder:text-ash focus:border-accent focus:outline-none"
            />
            <div className="flex justify-between gap-4 type-small text-ash">
              <span>{create.promptHint}</span>
              <span className={cn("tabular-nums", prompt.length > POLICY.promptMaxChars - 50 && "text-accent")}>
                {prompt.length}/{POLICY.promptMaxChars}
              </span>
            </div>
          </div>

          {!ready ? null : profile ? (
            <div className="flex flex-col gap-4">
              {quota && (
                <p className="type-label text-fog">
                  <span className="text-accent">[</span> {create.quota(quota.remaining, quota.limit)}{" "}
                  <span className="text-accent">]</span>
                </p>
              )}
              <Button
                variant="solid"
                onClick={generate}
                disabled={status === "generating" || limitReached || !prompt.trim()}
              >
                {status === "generating" ? create.generating : create.generate}
              </Button>
              {limitReached && (
                <p className="type-small text-fog">
                  {create.limitReached}{" "}
                  <Link href="/pricing?reason=limit" className="text-accent underline-offset-4 hover:underline">
                    See plans
                  </Link>
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Button href={nextHref} variant="solid">
                {create.signInToGenerate}
              </Button>
              <p className="type-small text-ash">{create.signedOutNote}</p>
            </div>
          )}

          {message && (
            <p role="alert" className="border-l-2 border-danger pl-3 type-small text-paper">
              {message}
            </p>
          )}
          {swaps.length > 0 && (
            <div role="status" className="border-l-2 border-accent pl-3 type-small text-fog">
              {create.franchiseNotice}
              <ul className="mt-1">
                {swaps.map((s) => (
                  <li key={s.from}>
                    “{s.from}” → {s.to}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <BracketLabel>{status === "generating" ? create.stages[stage] : create.previewLabel}</BracketLabel>
          {status === "generating" ? (
            <div className="relative flex aspect-video items-center justify-center overflow-hidden border border-line bg-panel">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-line">
                <div
                  className="h-full bg-accent transition-[width] duration-700 ease-snap"
                  style={{ width: `${((stage + 1) / create.stages.length) * 100}%` }}
                />
              </div>
              <p className="animate-pulse type-body text-fog">{create.stages[stage]}…</p>
            </div>
          ) : game ? (
            <GamePlayer
              html={game.html}
              title={game.prompt.slice(0, 60)}
              aspect={templateInfo(game.template).aspect}
              onError={(m) => setErrors((list) => [...list, m].slice(-10))}
            />
          ) : (
            <GamePlayer src={`/games/${template}.html`} title={`Example: ${info.sampleTitle}`} aspect={info.aspect} />
          )}
        </div>
      </div>
      {profile && game && status === "ready" && (
        <Workbench
          game={game}
          profile={profile}
          errors={errors}
          onReplace={(next) => {
            setGame(next);
            setErrors([]);
          }}
          onBuildUsed={() => void refreshQuota()}
        />
      )}
    </div>
  );
}
