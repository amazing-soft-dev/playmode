"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useProfile } from "@/components/auth/useProfile";
import { GameCover } from "@/components/game/GameCover";
import { BracketLabel, Button, Card, Tag } from "@/components/ui";
import { utcDateKey } from "@/lib/domain/time";
import type { Game, Streak } from "@/lib/domain/types";
import { playHref } from "@/lib/play-href";
import { type Quota, buildQuota } from "@/lib/quota";
import { browserRepos } from "@/lib/repos";

const STATUS_LABEL: Record<Game["status"], string> = {
  draft: "Draft",
  published: "Published",
  hidden: "Hidden for review",
  removed: "Removed",
};

/** /account: the player's games, today's build usage, plan and streak (plan section 06). */
export function AccountDashboard() {
  const { profile, ready, signOut } = useProfile();
  const [games, setGames] = useState<Game[]>([]);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);

  useEffect(() => {
    if (!profile) return;
    let alive = true;
    const repos = browserRepos();
    void Promise.all([
      repos.games.listByOwner(profile.id),
      repos.usage.get(profile.id, utcDateKey()),
      repos.challenges.streak(profile.id),
    ]).then(([g, u, s]) => {
      if (!alive) return;
      setGames(g.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setQuota(buildQuota(profile.plan, u));
      setStreak(s);
    });
    return () => {
      alive = false;
    };
  }, [profile]);

  if (!ready) return <div className="h-64 border border-line bg-panel" />;
  if (!profile) {
    return (
      <div className="flex flex-col items-start gap-6">
        <h2 className="type-h3">Sign in to see your games</h2>
        <p className="type-body text-fog">Your games, builds and streak live here once you have an account.</p>
        <Button href="/login?next=/account">Sign in</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="flex flex-col gap-3 p-6">
          <BracketLabel>Signed in as</BracketLabel>
          <p className="type-h4">{profile.displayName}</p>
          <p className="type-small text-ash">
            {profile.nicknameGenerated ? "Generated nickname (under 18)" : "Display name"} · {profile.country}
          </p>
        </Card>
        <Card className="flex flex-col gap-3 p-6">
          <BracketLabel>Builds today</BracketLabel>
          <p className="type-stat font-semibold text-accent">{quota ? `${quota.remaining}/${quota.limit}` : "—"}</p>
          <p className="type-small text-ash">
            {profile.plan === "plus" ? "Plus plan" : "Free plan"} ·{" "}
            <Link href="/pricing" className="hover:text-accent">
              {profile.plan === "plus" ? "Manage" : "Upgrade"}
            </Link>
          </p>
        </Card>
        <Card className="flex flex-col gap-3 p-6">
          <BracketLabel>Daily streak</BracketLabel>
          <p className="type-stat font-semibold">{streak ? streak.current : "—"}</p>
          <p className="type-small text-ash">
            Best {streak?.best ?? 0} ·{" "}
            <Link href="/daily" className="hover:text-accent">
              Play today
            </Link>
          </p>
        </Card>
      </div>

      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="type-h3">My games</h2>
          <Button href="/create" variant="secondary">
            Make a game
          </Button>
        </div>
        {games.length === 0 ? (
          <p className="type-body text-fog">No games yet. Your drafts and published games will show up here.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <li key={game.id}>
                <Card interactive className="h-full">
                  <Link href={playHref(game)} className="flex h-full flex-col">
                    <span className="relative block aspect-[16/10] overflow-hidden border-b border-line">
                      <GameCover id={game.id} template={game.template} title={game.title} />
                    </span>
                    <span className="flex flex-col gap-3 p-5">
                      <span className="type-h4 text-[20px] group-hover/card:text-accent">{game.title}</span>
                      <span className="flex flex-wrap gap-2">
                        <Tag className={game.status === "published" ? "border-accent text-accent" : ""}>
                          {STATUS_LABEL[game.status]}
                        </Tag>
                        <Tag>{game.likeCount} likes</Tag>
                      </span>
                    </span>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="border-t border-line pt-8">
        <Button variant="link" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
