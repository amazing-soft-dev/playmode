"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useProfile } from "@/components/auth/useProfile";
import { GamePlayer } from "@/components/game/GamePlayer";
import { Countdown } from "@/components/home/Countdown";
import { BracketLabel, Card } from "@/components/ui";
import { daily } from "@/content/daily";
import { anonymousId } from "@/lib/anon-id";
import { utcDateKey } from "@/lib/domain/time";
import type { ChallengeScore, DailyChallenge as Challenge, Streak } from "@/lib/domain/types";
import { templateInfo } from "@/lib/fixtures/templates";
import { browserRepos } from "@/lib/repos";
import { cn } from "@/lib/cn";

/**
 * Today's challenge: the game for the current UTC day, the player's streak, and the top 100.
 * Signed-in players appear by display name (a generated nickname under 18). Anonymous players,
 * including under-13s, are tracked by a random browser id only and listed as "Guest player".
 */
export function DailyChallenge() {
  const { profile, ready } = useProfile();
  const [today] = useState(() => utcDateKey());
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [board, setBoard] = useState<ChallengeScore[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    const id = profile?.id ?? anonymousId();
    let alive = true;
    const repo = browserRepos().challenges;
    void Promise.all([repo.forDate(today), repo.leaderboard(today), repo.streak(id)]).then(([c, b, s]) => {
      if (!alive) return;
      setPlayerId(id);
      setChallenge(c);
      setBoard(b);
      setStreak(s);
    });
    return () => {
      alive = false;
    };
  }, [ready, profile, today]);

  const onScore = useCallback(
    async (score: number) => {
      if (!playerId) return;
      const repo = browserRepos().challenges;
      const result = await repo.submitScore({
        date: today,
        playerId,
        anonymous: !profile,
        displayName: profile?.displayName ?? daily.guest,
        score,
      });
      setMessage(result.accepted ? daily.submitted(score) : (result.reason ?? null));
      if (result.accepted) {
        const [b, s] = await Promise.all([repo.leaderboard(today), repo.streak(playerId)]);
        setBoard(b);
        setStreak(s);
      }
    },
    [playerId, profile, today],
  );

  const info = challenge ? templateInfo(challenge.template) : null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-[60px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <BracketLabel accent>{daily.themeLabel}</BracketLabel>
            <h2 className="type-h3">{challenge ? challenge.theme : "Loading…"}</h2>
            {info && <p className="type-small text-fog">{`${info.sampleTitle} · ${info.controls}`}</p>}
          </div>
          <p className="flex flex-col items-end gap-2">
            <span className="type-label text-ash">{daily.nextLabel}</span>
            <Countdown className="font-mono text-[32px] leading-none font-thin text-accent tabular-nums" />
          </p>
        </div>
        {challenge && info ? (
          <GamePlayer
            src={`/games/${challenge.template}.html`}
            title={challenge.theme}
            aspect={info.aspect}
            onScore={onScore}
          />
        ) : (
          <div className="aspect-video border border-line bg-panel" />
        )}
        {message && (
          <p role="status" className="border-l-2 border-accent pl-3 type-small text-paper">
            {message}
          </p>
        )}
        {ready && (
          <p className="type-small text-ash">
            {profile ? null : (
              <>
                {daily.anonymousNote}{" "}
                <Link href="/login?next=/daily" className="text-accent underline-offset-4 hover:underline">
                  {daily.signInPrompt}
                </Link>
              </>
            )}
          </p>
        )}
        <ul className="flex flex-col gap-2 border-t border-line pt-6 type-small text-fog">
          {daily.rules.map((rule) => (
            <li key={rule}>— {rule}</li>
          ))}
        </ul>
      </div>

      <aside className="flex flex-col gap-6">
        <Card className="flex items-end justify-between gap-6 p-6">
          <div className="flex flex-col gap-2">
            <span className="type-label text-ash">{daily.streakLabel}</span>
            <span className="type-stat font-semibold text-accent">{streak ? daily.days(streak.current) : "—"}</span>
          </div>
          <span className="type-label text-fog">
            {daily.bestLabel} {streak ? daily.days(streak.best) : "—"}
          </span>
        </Card>

        <div className="flex flex-col gap-4">
          <BracketLabel>{daily.leaderboardLabel}</BracketLabel>
          <h2 className="type-h4">{daily.leaderboardTitle}</h2>
          <ol className="flex max-h-[560px] flex-col overflow-y-auto border-t border-line">
            {board.map((row, i) => {
              const mine = row.playerId === playerId;
              return (
                <li
                  key={row.playerId}
                  className={cn(
                    "flex items-center gap-4 border-b border-line px-1 py-3 type-small",
                    mine && "bg-accent-soft text-paper",
                  )}
                >
                  <span className="w-8 text-ash tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 truncate">
                    {row.displayName}
                    {mine && <span className="ml-2 text-accent">({daily.you})</span>}
                  </span>
                  <span className="tabular-nums">{row.score.toLocaleString("en-US")}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>
    </div>
  );
}
