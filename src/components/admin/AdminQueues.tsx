"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useProfile } from "@/components/auth/useProfile";
import { BracketLabel, Button, Card, Tag } from "@/components/ui";
import { POLICY } from "@/lib/domain/policy";
import type { DailyChallenge, Game, Report } from "@/lib/domain/types";
import { templateInfo } from "@/lib/fixtures/templates";
import { playHref } from "@/lib/play-href";
import { browserRepos } from "@/lib/repos";

/**
 * Founder-only admin (plan sections 05 and 11): approve upcoming daily challenges (about five
 * minutes a day; unapproved days fall back to the backlog) and work the report queue within
 * 48 hours (dismiss restores a hidden game, remove takes it down for good).
 */
export function AdminQueues() {
  const { profile, ready } = useProfile();
  const [pending, setPending] = useState<DailyChallenge[]>([]);
  const [reports, setReports] = useState<(Report & { game: Game | null })[]>([]);

  const load = useCallback(async () => {
    const repos = browserRepos();
    const [p, queue] = await Promise.all([repos.challenges.listPending(), repos.reports.listQueue()]);
    const withGames = await Promise.all(queue.map(async (r) => ({ ...r, game: await repos.games.get(r.gameId) })));
    setPending(p);
    setReports(withGames);
  }, []);

  useEffect(() => {
    if (!profile?.isAdmin) return;
    let alive = true;
    const repos = browserRepos();
    void Promise.all([repos.challenges.listPending(), repos.reports.listQueue()]).then(async ([p, queue]) => {
      const withGames = await Promise.all(queue.map(async (r) => ({ ...r, game: await repos.games.get(r.gameId) })));
      if (!alive) return;
      setPending(p);
      setReports(withGames);
    });
    return () => {
      alive = false;
    };
  }, [profile]);

  if (!ready) return <div className="h-64 border border-line bg-panel" />;
  if (!profile?.isAdmin) {
    return (
      <div className="flex flex-col items-start gap-6">
        <h2 className="type-h3">Founders only</h2>
        <p className="type-body text-fog">This page is for the PlayerMode team.</p>
        <Button href="/">Back to home</Button>
      </div>
    );
  }

  const approve = async (date: string) => {
    await browserRepos().challenges.approve(date, profile.id);
    await load();
  };

  const resolve = async (id: string, status: "actioned" | "dismissed") => {
    await browserRepos().reports.resolve(id, status);
    await load();
  };

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <section className="flex flex-col gap-6">
        <BracketLabel accent>Daily challenges</BracketLabel>
        <h2 className="type-h3">Next 7 days</h2>
        <p className="type-small text-ash">
          Approve each day before 00:00 UTC. Unapproved days use the approved backlog (at least {POLICY.challengeBacklogMin} entries).
        </p>
        <ul className="flex flex-col border-t border-line">
          {pending.map((c) => (
            <li key={c.date} className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-4">
              <span className="flex flex-col gap-1">
                <span className="type-label text-ash">{c.date}</span>
                <span className="type-body">
                  {c.theme} <span className="text-ash">· {templateInfo(c.template).genre}</span>
                </span>
              </span>
              {c.status === "approved" ? (
                <Tag className="border-accent text-accent">Approved</Tag>
              ) : (
                <span className="flex items-center gap-4">
                  <a href={`/games/${c.template}.html`} target="_blank" rel="noopener" className="type-label hover:text-accent">
                    Preview
                  </a>
                  <Button variant="secondary" arrow={false} onClick={() => approve(c.date)}>
                    Approve
                  </Button>
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <BracketLabel accent>Reports</BracketLabel>
        <h2 className="type-h3">Open queue ({reports.length})</h2>
        <p className="type-small text-ash">
          Review within {POLICY.reportReviewHours} hours. Games with {POLICY.reportHideThreshold} or more reports are already hidden.
        </p>
        {reports.length === 0 ? (
          <p className="type-body text-fog">No open reports.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {reports.map((r) => (
              <li key={r.id}>
                <Card className="flex flex-col gap-3 p-5" crosses={false}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {r.game ? (
                      <Link href={playHref(r.game)} className="type-h4 text-[20px] hover:text-accent">
                        {r.game.title}
                      </Link>
                    ) : (
                      <span className="type-h4 text-[20px]">Unknown game</span>
                    )}
                    <Tag>{r.reason}</Tag>
                  </div>
                  {r.details && <p className="type-small text-fog">“{r.details}”</p>}
                  <p className="type-label text-ash">
                    {new Date(r.createdAt).toUTCString()} · {r.game?.status === "hidden" ? "hidden" : "visible"}
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" arrow={false} onClick={() => resolve(r.id, "dismissed")}>
                      Dismiss
                    </Button>
                    <Button variant="solid" onClick={() => resolve(r.id, "actioned")}>
                      Remove game
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
