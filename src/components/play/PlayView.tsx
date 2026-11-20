"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { useProfile } from "@/components/auth/useProfile";
import { IS_STATIC_EXPORT } from "@/components/forms/useFormPost";
import { GamePlayer } from "@/components/game/GamePlayer";
import { BracketLabel, Button, DownloadIcon, Field, FlagIcon, HeartIcon, Select, Tag, Textarea } from "@/components/ui";
import { anonymousId } from "@/lib/anon-id";
import type { Game, ReportReason } from "@/lib/domain/types";
import { LICENSE_NAMES, saveFile, slugify, withLicenseHeader } from "@/lib/download";
import { templateInfo } from "@/lib/fixtures/templates";
import { withDocumentTitle } from "@/lib/game-title";
import { browserRepos } from "@/lib/repos";
import { cn } from "@/lib/cn";

const REASONS: { id: ReportReason; label: string }[] = [
  { id: "inappropriate", label: "Not suitable for kids" },
  { id: "copyright", label: "Copies someone else's game or characters" },
  { id: "broken", label: "Broken or doesn't load" },
  { id: "spam", label: "Spam" },
  { id: "other", label: "Something else" },
];

/**
 * Play page body (plan section 06, /play/[id]): the sandboxed player, like (once, signed in),
 * report (three reports hide the game until review), download when the creator allows it, the
 * license, and share. `id` comes from the route, or from ?id= for games published in this browser.
 */
export function PlayView({ id: routeId }: { id: string }) {
  const params = useSearchParams();
  const id = routeId === "local" ? (params.get("id") ?? "") : routeId;
  const { profile } = useProfile();
  const [game, setGame] = useState<Game | null | undefined>(undefined);
  const [html, setHtml] = useState<string | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const repo = browserRepos().games;
    void (async () => {
      const g = await repo.get(id);
      if (!alive) return;
      setGame(g);
      if (!g) return;
      setLikes(g.likeCount);
      const [version, stored] = await Promise.all([
        repo.getVersion(g.currentVersionId),
        repo.getVersionHtml(g.currentVersionId),
      ]);
      if (!alive) return;
      if (stored) setHtml(stored);
      else if (version) setSrc(version.htmlPath);
      void repo.recordPlay(g.id);
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!profile || !game) return;
    let alive = true;
    void browserRepos()
      .games.hasLiked(game.id, profile.id)
      .then((v) => alive && setLiked(v));
    return () => {
      alive = false;
    };
  }, [profile, game]);

  if (game === undefined) return <div className="aspect-video border border-line bg-panel" />;
  if (game === null || game.status === "removed" || (game.status === "draft" && game.ownerId !== profile?.id)) {
    return (
      <div className="flex flex-col items-start gap-6">
        <h1 className="type-h2">Game not found</h1>
        <p className="type-body text-fog">It may have been removed or never published.</p>
        <Button href="/gallery">Back to the gallery</Button>
      </div>
    );
  }

  const info = templateInfo(game.template);
  const hidden = game.status === "hidden";

  const like = async () => {
    if (!profile || liked) return;
    setLikes(await browserRepos().games.like(game.id, profile.id));
    setLiked(true);
  };

  const report = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const reason = String(data.get("reason")) as ReportReason;
    const details = String(data.get("details") ?? "");
    await browserRepos().reports.create(game.id, profile?.id ?? anonymousId(), reason, details);
    // Alert the team too (server build only); the report is already recorded either way.
    if (!IS_STATIC_EXPORT) {
      void fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ gameId: game.id, reason, details }),
      }).catch(() => undefined);
    }
    setReportOpen(false);
    setNotice("Thanks. We review reports within 48 hours, and games with several reports are hidden until then.");
  };

  const download = () => {
    const source = html;
    const finish = (text: string) =>
      saveFile(
        `${slugify(game.title)}.html`,
        withLicenseHeader(withDocumentTitle(text, game.title), {
          title: game.title,
          creator: game.ownerName,
          license: game.license,
        }),
        "text/html",
      );
    if (source) finish(source);
    else if (src)
      void fetch(src)
        .then((r) => r.text())
        .then(finish);
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: game.title, url }).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(url);
      setNotice("Link copied.");
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-[60px]">
      <div className="flex flex-col gap-6">
        {hidden ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 border border-line bg-panel p-6 text-center">
            <p className="type-h4">Hidden while we review it</p>
            <p className="max-w-md type-small text-fog">
              Players reported this game. Our team reviews reports within 48 hours.
            </p>
          </div>
        ) : html || src ? (
          <GamePlayer
            html={html ?? undefined}
            src={html ? undefined : (src ?? undefined)}
            title={game.title}
            gameTitle={game.title}
            aspect={info.aspect}
          />
        ) : (
          <div className="aspect-video border border-line bg-panel" />
        )}
        {notice && (
          <p role="status" className="border-l-2 border-accent pl-3 type-small text-paper">
            {notice}
          </p>
        )}
      </div>

      <aside className="flex flex-col gap-6">
        <BracketLabel accent>{info.genre}</BracketLabel>
        <h1 className="type-h3">{game.title}</h1>
        <p className="type-body text-fog">{game.description}</p>
        <p className="type-label text-ash">by {game.ownerName}</p>
        <div className="flex flex-wrap gap-2">
          {game.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-y border-line py-4">
          {profile ? (
            <button
              type="button"
              onClick={like}
              aria-pressed={liked}
              disabled={liked}
              className={cn(
                "inline-flex min-h-6 items-center gap-2 type-caps transition-colors max-sm:min-h-11",
                liked ? "text-accent" : "hover:text-accent",
              )}
            >
              <HeartIcon filled={liked} className="size-4" /> {likes.toLocaleString("en-US")}
            </button>
          ) : (
            <Link
              href={`/login?next=${encodeURIComponent(`/play/${routeId === "local" ? `local?id=${id}` : id}`)}`}
              className="inline-flex min-h-6 items-center gap-2 type-caps hover:text-accent max-sm:min-h-11"
            >
              <HeartIcon className="size-4" /> {likes.toLocaleString("en-US")}
            </Link>
          )}
          {game.allowDownload && (
            <button
              type="button"
              onClick={download}
              className="inline-flex min-h-6 items-center gap-2 type-caps hover:text-accent max-sm:min-h-11"
            >
              <DownloadIcon className="size-4" /> Download
            </button>
          )}
          <button
            type="button"
            onClick={share}
            className="inline-flex min-h-6 items-center type-caps hover:text-accent max-sm:min-h-11"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => setReportOpen((v) => !v)}
            className="ml-auto inline-flex min-h-6 items-center gap-2 type-caps text-ash hover:text-accent max-sm:min-h-11"
          >
            <FlagIcon className="size-4" /> Report
          </button>
        </div>

        {reportOpen && (
          <form onSubmit={report} className="flex flex-col gap-4 border border-line p-5">
            <Field label="What's wrong?">
              {({ id: fieldId }) => (
                <Select id={fieldId} name="reason" defaultValue="inappropriate">
                  {REASONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            {profile && (
              <Field label="Details (optional)">
                {({ id: fieldId }) => <Textarea id={fieldId} name="details" maxLength={500} rows={3} />}
              </Field>
            )}
            <Button type="submit" variant="secondary" arrow={false}>
              Send report
            </Button>
          </form>
        )}

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 type-small text-fog">
          <dt className="text-ash">License</dt>
          <dd>{LICENSE_NAMES[game.license]}</dd>
          <dt className="text-ash">Plays</dt>
          <dd>{game.playCount.toLocaleString("en-US")}</dd>
          <dt className="text-ash">Controls</dt>
          <dd>{info.controls}</dd>
        </dl>
        <Button href={`/create?template=${game.template}`} variant="secondary">
          Make your own
        </Button>
      </aside>
    </div>
  );
}
