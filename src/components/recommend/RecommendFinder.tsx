"use client";

import { type FormEvent, useState } from "react";

import { useProfile } from "@/components/auth/useProfile";
import { Reveal } from "@/components/motion";
import { ArrowIcon, BracketLabel, Button, Card, Checkbox, Chip, Tag } from "@/components/ui";
import { recommend } from "@/content/recommend";
import { disclosures } from "@/content/site";
import type { CatalogGame, PlatformFamily, RecommendationFilters } from "@/lib/domain/types";
import { CATALOG_GENRES } from "@/lib/fixtures/catalog";
import { applyAudience, filterKey } from "@/lib/recommend";
import { browserRepos } from "@/lib/repos";

interface Pick {
  game: CatalogGame;
  reason: string;
}

const CACHE_KEY = "pm.reccache.v1";
const DAY = 24 * 60 * 60 * 1000;

/** 24-hour cache of catalog results per filter set (plan section 05: identical queries cached). */
function cached(key: string): CatalogGame[] | null {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as Record<
      string,
      { at: number; results: CatalogGame[] }
    >;
    const hit = all[key];
    return hit && Date.now() - hit.at < DAY ? hit.results : null;
  } catch {
    return null;
  }
}

function remember(key: string, results: CatalogGame[]) {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as Record<string, unknown>;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...all, [key]: { at: Date.now(), results } }));
  } catch {
    // Cache is optional.
  }
}

/**
 * Ask → parse → query → explain → build your own instead. The parse step returns filters only;
 * results always come from the catalog, and each line is written from that record's own fields.
 */
export function RecommendFinder() {
  const { profile } = useProfile();
  const band = profile?.ageBand ?? "unknown";
  const [text, setText] = useState("");
  const [price, setPrice] = useState<RecommendationFilters["price"]>("any");
  const [platforms, setPlatforms] = useState<PlatformFamily[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [kidFriendly, setKidFriendly] = useState(false);
  const [picks, setPicks] = useState<Pick[] | null>(null);
  const [fallback, setFallback] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastRequest, setLastRequest] = useState("");

  const toggle = <T,>(list: T[], value: T) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setFallback(false);
    const { ai, catalog } = browserRepos();
    try {
      const parsed = await ai.parseRequest(text, {
        price,
        platforms,
        genres,
        ...(kidFriendly ? { ratingCeiling: "E10+" as const } : { ratingCeiling: "M" as const }),
      });
      const filters = applyAudience(parsed, band);
      const key = filterKey(filters);
      let results = cached(key);
      if (!results) {
        results = await catalog.search(filters, 10);
        remember(key, results);
      }
      const lines = await ai.explain(text, results);
      // Any game the explain step mentions that is not in the results is ignored: lines are keyed by catalog id.
      setPicks(results.map((game) => ({ game, reason: lines.get(game.id) ?? "" })));
    } catch {
      const results = await browserRepos().catalog.fallback();
      setFallback(true);
      setPicks(results.map((game) => ({ game, reason: "" })));
    } finally {
      setLastRequest(text);
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <form onSubmit={submit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-3">
          <span className="type-label text-fog">{recommend.askLabel}</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 300))}
            placeholder={recommend.askPlaceholder}
            className="h-14 border border-ash bg-ink px-4 type-body text-paper placeholder:text-ash focus:border-accent focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {recommend.priceChips.map((c) => (
            <Chip key={c.id} selected={price === c.id} onClick={() => setPrice(c.id as RecommendationFilters["price"])}>
              {c.label}
            </Chip>
          ))}
          <span aria-hidden className="mx-2 w-px bg-line" />
          {recommend.platformChips.map((c) => (
            <Chip
              key={c.id}
              selected={platforms.includes(c.id as PlatformFamily)}
              onClick={() => setPlatforms((p) => toggle(p, c.id as PlatformFamily))}
            >
              {c.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <span className="type-label text-ash">{recommend.genreLabel}</span>
          <div className="flex flex-wrap gap-2">
            {CATALOG_GENRES.map((g) => (
              <Chip key={g} selected={genres.includes(g)} onClick={() => setGenres((list) => toggle(list, g))}>
                {g}
              </Chip>
            ))}
          </div>
        </div>
        <Checkbox
          checked={kidFriendly}
          onChange={(e) => setKidFriendly(e.target.checked)}
          label={recommend.kidFriendly}
        />
        <div className="flex flex-wrap items-center gap-6">
          <Button type="submit" variant="solid" disabled={busy}>
            {busy ? "Searching…" : recommend.submit}
          </Button>
          {band === "unknown" && <p className="type-small text-ash">{recommend.childSafeNote}</p>}
        </div>
      </form>

      {picks && (
        <section aria-live="polite" className="flex flex-col gap-6">
          <BracketLabel>{recommend.resultsLabel}</BracketLabel>
          {fallback && <p className="type-small text-fog">{recommend.fallbackNote}</p>}
          {picks.length === 0 && <p className="type-body text-fog">{recommend.noResults}</p>}
          <ul className="grid gap-5 md:grid-cols-2">
            {picks.map(({ game, reason }, i) => (
              <Reveal as="li" key={game.id} index={i % 2}>
                <Card className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="type-h4">{game.name}</h3>
                    <Tag className={game.price === "free" ? "border-accent text-accent" : ""}>
                      {game.price === "free" ? recommend.free : recommend.paid}
                    </Tag>
                  </div>
                  {reason && <p className="type-small text-fog">{reason}</p>}
                  <div className="flex flex-wrap gap-2">
                    {game.esrb && <Tag>ESRB {game.esrb}</Tag>}
                    {game.genres.slice(0, 3).map((g) => (
                      <Tag key={g}>{g}</Tag>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 type-caps">
                    {game.stores.map((s) => (
                      <a
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel={`noopener noreferrer${s.affiliate ? " sponsored" : ""}`}
                        className="inline-flex items-center gap-2 hover:text-accent"
                      >
                        {recommend.viewOn} {s.store}
                        <ArrowIcon className="size-4" />
                      </a>
                    ))}
                    <a
                      href={game.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ash hover:text-accent"
                    >
                      {recommend.sourceLink}
                    </a>
                  </div>
                </Card>
              </Reveal>
            ))}
            <li>
              <Card interactive className="flex h-full flex-col justify-between gap-6 border-dashed p-6">
                <div className="flex flex-col gap-3">
                  <h3 className="type-h4 text-accent">{recommend.buildInstead.title}</h3>
                  <p className="type-small text-fog">{recommend.buildInstead.text}</p>
                </div>
                <Button href={`/create?prompt=${encodeURIComponent(lastRequest)}`} variant="secondary">
                  {recommend.buildInstead.cta}
                </Button>
              </Card>
            </li>
          </ul>
          <p className="type-small text-ash">
            {disclosures.affiliate}{" "}
            <a
              href="https://rawg.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-accent hover:underline"
            >
              {disclosures.rawg}
            </a>
            .
          </p>
        </section>
      )}
    </div>
  );
}
