"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";

import { Button, Checkbox, Chip, DownloadIcon, Field, Input, Select, Textarea } from "@/components/ui";
import { create } from "@/content/create";
import { POLICY } from "@/lib/domain/policy";
import { utcDateKey } from "@/lib/domain/time";
import type { GameVersion, License, Profile, TemplateId } from "@/lib/domain/types";
import { LICENSE_NAMES, buildZip, saveFile, slugify, withLicenseHeader } from "@/lib/download";
import { moderatePrompt, moderateText } from "@/lib/moderation";
import { playHref } from "@/lib/play-href";
import { repairCostsBuild } from "@/lib/quota";
import { browserRepos } from "@/lib/repos";

export interface WorkbenchGame {
  html: string;
  prompt: string;
  template: TemplateId;
  model: string;
}

interface WorkbenchProps {
  game: WorkbenchGame;
  profile: Profile;
  /** Errors the player reported for the current version (for Fix it). */
  errors: string[];
  /** Replace the game in the player (after a change, fix or version restore). */
  onReplace: (game: WorkbenchGame) => void;
  /** A change or repair that counts as a build was made. */
  onBuildUsed: () => void;
}

const SUGGESTIONS = ["Slower enemies", "Bigger buttons", "More levels", "Add a timer", "Brighter colours"];

/**
 * Steps 4–5 of the maker (plan section 05): change it, fix it, keep versions, save, publish and
 * download. Saving creates a private draft; every later change or fix adds a version (the last
 * five are kept). Publishing moderates the title, description and tags first.
 */
export function Workbench({ game, profile, errors, onReplace, onBuildUsed }: WorkbenchProps) {
  const [draftId, setDraftId] = useState<string | null>(null);
  const [versions, setVersions] = useState<GameVersion[]>([]);
  const [change, setChange] = useState("");
  const [busy, setBusy] = useState<"change" | "fix" | "save" | "publish" | null>(null);
  const [repairs, setRepairs] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  // A new game from the maker starts a new draft.
  const [lastPrompt, setLastPrompt] = useState(game.prompt);
  if (game.prompt !== lastPrompt && !game.prompt.startsWith(lastPrompt)) {
    setLastPrompt(game.prompt);
    setDraftId(null);
    setVersions([]);
    setRepairs(0);
    setPublishedId(null);
  }

  useEffect(() => {
    if (!draftId) return;
    let alive = true;
    void browserRepos()
      .games.listVersions(draftId)
      .then((v) => alive && setVersions(v));
    return () => {
      alive = false;
    };
  }, [draftId, game.html]);

  const persist = async (next: WorkbenchGame) => {
    const repo = browserRepos().games;
    if (!draftId) {
      const { game: saved } = await repo.saveDraft({ ownerId: profile.id, ownerName: profile.displayName, ...next });
      setDraftId(saved.id);
      return saved.id;
    }
    await repo.addVersion(draftId, profile.id, next);
    return draftId;
  };

  const applyChange = async (instruction: string) => {
    const checked = moderatePrompt(instruction);
    if (!checked.ok) return setNote(checked.message);
    setBusy("change");
    setNote(null);
    try {
      const result = await browserRepos().ai.change(game.html, checked.prompt);
      await browserRepos().usage.recordBuild(profile.id, utcDateKey());
      onBuildUsed();
      const next = { ...game, html: result.html, prompt: `${game.prompt} — ${checked.prompt}` };
      if (draftId) await persist(next);
      onReplace(next);
      setChange("");
      setRepairs(0);
    } catch {
      setNote(create.failedNoCharge);
    } finally {
      setBusy(null);
    }
  };

  const fix = async () => {
    setBusy("fix");
    setNote(null);
    try {
      const result = await browserRepos().ai.repair(game.html, errors);
      if (repairCostsBuild(repairs)) {
        await browserRepos().usage.recordBuild(profile.id, utcDateKey());
        onBuildUsed();
      } else {
        await browserRepos().usage.recordRepair(profile.id, utcDateKey());
      }
      setRepairs((r) => r + 1);
      const next = { ...game, html: result.html };
      if (draftId) await persist(next);
      onReplace(next);
    } catch {
      setNote(create.failedNoCharge);
    } finally {
      setBusy(null);
    }
  };

  const saveDraft = async () => {
    setBusy("save");
    try {
      await persist(game);
      setNote("Saved to your account as a private draft.");
    } finally {
      setBusy(null);
    }
  };

  const restore = async (version: GameVersion) => {
    const html = await browserRepos().games.getVersionHtml(version.id);
    if (html) onReplace({ ...game, html, prompt: version.prompt });
  };

  const download = (kind: "html" | "zip") => {
    const info = { title: game.prompt.slice(0, 60), creator: profile.displayName, license: "all-rights-reserved" as License };
    const name = slugify(info.title);
    if (kind === "html") saveFile(`${name}.html`, withLicenseHeader(game.html, info), "text/html");
    else saveFile(`${name}.zip`, buildZip(game.html, info), "application/zip");
  };

  const publish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title")).trim();
    const description = String(data.get("description")).trim();
    const tags = String(data.get("tags"))
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5);
    for (const text of [title, description, tags.join(" ")]) {
      const verdict = moderateText(text);
      if (!verdict.ok) return setNote(verdict.message);
    }
    setBusy("publish");
    try {
      // An existing draft is published as is; only an unsaved game is saved first.
      const id = draftId ?? (await persist(game));
      await browserRepos().games.publish(id, profile.id, {
        title,
        description,
        tags: tags.length ? tags : [game.template],
        license: String(data.get("license")) as License,
        allowDownload: data.get("allowDownload") === "on",
      });
      setPublishedId(id);
      setPublishOpen(false);
      setNote(null);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 border-t border-line pt-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="type-label text-fog">4. Change it</p>
          <Textarea
            value={change}
            onChange={(e) => setChange(e.target.value.slice(0, POLICY.promptMaxChars))}
            placeholder="Make the enemies slower and add a second level"
            rows={3}
          />
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Chip key={s} onClick={() => setChange(s)}>
                {s}
              </Chip>
            ))}
          </div>
          <Button variant="secondary" onClick={() => applyChange(change)} disabled={!change.trim() || busy !== null}>
            {busy === "change" ? "Changing…" : "Change it"}
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          <p className="type-label text-fog">Fix it</p>
          <p className="type-small text-ash">
            {errors.length > 0
              ? `The game reported ${errors.length} error${errors.length === 1 ? "" : "s"}. Fix it sends them back to the AI for a repair pass.`
              : "No errors reported. If the game looks broken, Fix it asks the AI for a repair pass."}{" "}
            The first {POLICY.freeRepairsPerBuild} fixes per build are free.
          </p>
          <Button variant="secondary" onClick={fix} disabled={busy !== null}>
            {busy === "fix" ? "Fixing…" : "Fix it"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="type-label text-fog">5. Save, publish or download</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" arrow={false} onClick={saveDraft} disabled={busy !== null}>
            {draftId ? "Save version" : "Save draft"}
          </Button>
          <Button onClick={() => setPublishOpen((v) => !v)} disabled={busy !== null}>
            Publish to gallery
          </Button>
          <button type="button" onClick={() => download("html")} className="type-caps inline-flex items-center gap-2 px-3 hover:text-accent">
            <DownloadIcon className="size-4" /> HTML
          </button>
          <button type="button" onClick={() => download("zip")} className="type-caps inline-flex items-center gap-2 px-3 hover:text-accent">
            <DownloadIcon className="size-4" /> itch.io zip
          </button>
        </div>
        {publishedId && (
          <p role="status" className="type-small text-accent">
            Published! <Link href={playHref({ id: publishedId })} className="underline underline-offset-4">Open the game page</Link>
          </p>
        )}
        {note && (
          <p role="status" className="type-small text-fog">
            {note}
          </p>
        )}
      </div>

      {publishOpen && (
        <form onSubmit={publish} className="grid gap-5 border border-line p-6 md:grid-cols-2">
          <Field label="Title">{({ id }) => <Input id={id} name="title" required maxLength={60} defaultValue={game.prompt.slice(0, 40)} />}</Field>
          <Field label="Tags" hint="Up to 5, separated by commas">
            {({ id, describedBy }) => <Input id={id} aria-describedby={describedBy} name="tags" defaultValue={game.template} maxLength={80} />}
          </Field>
          <Field label="Short description" className="md:col-span-2">
            {({ id }) => <Textarea id={id} name="description" required maxLength={160} rows={2} />}
          </Field>
          <Field label="License">
            {({ id }) => (
              <Select id={id} name="license" defaultValue="all-rights-reserved">
                {(Object.keys(LICENSE_NAMES) as License[]).map((l) => (
                  <option key={l} value={l}>
                    {LICENSE_NAMES[l]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <div className="flex items-end">
            <Checkbox name="allowDownload" label="Let players download this game" />
          </div>
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <Button type="submit" variant="solid" disabled={busy !== null}>
              {busy === "publish" ? "Publishing…" : "Publish"}
            </Button>
            <p className="type-small text-ash">Title, description and tags are checked before the game goes live.</p>
          </div>
        </form>
      )}

      {versions.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="type-label text-fog">Versions (last {POLICY.versionsKept})</p>
          <ol className="flex flex-col border-t border-line">
            {versions.map((v, i) => (
              <li key={v.id} className="type-small flex items-center justify-between gap-4 border-b border-line py-3">
                <span className="line-clamp-1 text-fog">
                  <span className="text-ash">v{versions.length - i}</span> {v.prompt}
                </span>
                <button type="button" onClick={() => restore(v)} className="type-label shrink-0 hover:text-accent">
                  Open
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
