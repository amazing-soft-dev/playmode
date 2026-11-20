"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CloseIcon, PlayIcon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { parseGameMessage, withErrorReporter } from "@/lib/game-messages";
import { type ScanIssue, scanGameHtml } from "@/lib/game-scan";
import { withDocumentTitle } from "@/lib/game-title";

export interface GamePlayerProps {
  /** Game HTML to run. Takes precedence over `src`. */
  html?: string;
  /** URL of a game file to fetch, scan and run (for example /games/runner.html). */
  src?: string;
  title: string;
  /**
   * The game's own name, written into the document's <title> before it runs so a game built on
   * a starter template shows its name on the title screen. Leave unset to keep the file's title.
   */
  gameTitle?: string;
  onScore?: (score: number) => void;
  onError?: (message: string) => void;
  /** Called once the document passed the scan and is running. */
  onReady?: (html: string) => void;
  className?: string;
  /** Logical aspect ratio of the frame. */
  aspect?: "video" | "portrait" | "square";
}

type Status = "loading" | "running" | "stopped" | "blocked" | "failed";

const ASPECT = { video: "aspect-video", portrait: "aspect-[9/16] max-h-[80vh]", square: "aspect-square" } as const;

/**
 * Runs untrusted game HTML (plan section 10):
 * - the document is scanned before it runs, and refused if the scan fails;
 * - the iframe has sandbox="allow-scripts" only, so the game gets an opaque origin and cannot
 *   read cookies or storage, submit forms, open popups or navigate the page;
 * - only {type:"score"} and {type:"error"} messages from this frame are accepted;
 * - Stop unloads the frame, which also ends an infinite loop.
 * Production serves game files from a separate domain with a strict CSP as well.
 */
export function GamePlayer({
  html,
  src,
  title,
  gameTitle,
  onScore,
  onError,
  onReady,
  className,
  aspect = "video",
}: GamePlayerProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [issues, setIssues] = useState<ScanIssue[]>([]);
  const [runId, setRunId] = useState(0);

  const callbacks = useRef({ onScore, onError, onReady });
  useEffect(() => {
    callbacks.current = { onScore, onError, onReady };
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStatus("loading");
      try {
        let source = "";
        if (html !== undefined) {
          source = html;
        } else if (src) {
          const res = await fetch(src);
          if (!res.ok) throw new Error(res.statusText);
          source = await res.text();
        }
        if (cancelled) return;
        if (gameTitle) source = withDocumentTitle(source, gameTitle);
        const scan = scanGameHtml(source);
        if (!scan.ok) {
          setIssues(scan.issues);
          setDoc(null);
          setStatus("blocked");
          return;
        }
        setIssues([]);
        setDoc(withErrorReporter(source));
        setStatus("running");
        callbacks.current.onReady?.(source);
      } catch {
        if (!cancelled) setStatus("failed");
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [html, src, gameTitle]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // Only the frame this player created may talk to it.
      if (!frameRef.current || event.source !== frameRef.current.contentWindow) return;
      const message = parseGameMessage(event.data);
      if (message?.type === "score") callbacks.current.onScore?.(message.value);
      if (message?.type === "error") callbacks.current.onError?.(message.message);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const restart = useCallback(() => {
    setRunId((n) => n + 1);
    setStatus((s) => (s === "stopped" ? "running" : s));
  }, []);

  const stop = useCallback(() => setStatus("stopped"), []);

  // Full screen: the Fullscreen API where the browser has it for elements; otherwise (iPhone
  // Safari) a fixed layer over the page with its own close button. `native` tracks the API state
  // so the phone prompt hides while the player is already full screen.
  const [expanded, setExpanded] = useState(false);
  const [native, setNative] = useState(false);

  const fullscreen = useCallback(() => {
    const el = wrapRef.current;
    if (el && typeof el.requestFullscreen === "function") {
      void el.requestFullscreen().catch(() => setExpanded(true));
    } else {
      setExpanded(true);
    }
  }, []);

  useEffect(() => {
    const onChange = () => setNative(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
    };
  }, [expanded]);

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div
        ref={wrapRef}
        className={cn(
          "w-full overflow-hidden",
          // Position, border and background come from one branch only, so no two utilities compete.
          expanded ? "fixed inset-0 z-50 h-dvh bg-ink" : cn("relative border border-line bg-panel", ASPECT[aspect]),
        )}
      >
        {status === "running" && doc !== null ? (
          <iframe
            key={runId}
            ref={frameRef}
            title={title}
            srcDoc={doc}
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full border-0 bg-ink"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            {status === "loading" && <p className="text-fog">Loading game…</p>}
            {status === "stopped" && (
              <>
                <p className="text-fog">Game stopped.</p>
                <button type="button" onClick={restart} className="text-accent underline-offset-4 hover:underline">
                  Start again
                </button>
              </>
            )}
            {status === "failed" && <p className="text-fog">This game could not be loaded.</p>}
            {status === "blocked" && (
              <div className="max-w-md">
                <p className="text-paper">This game was blocked by the safety check.</p>
                <ul className="mt-3 space-y-1 text-left text-ash">
                  {issues.slice(0, 4).map((issue) => (
                    <li key={`${issue.rule}-${issue.message}`}>— {issue.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {/* Phones: a 350px-wide canvas makes in-game text tiny, so offer full screen up front. */}
        {status === "running" && !expanded && !native && (
          <button
            type="button"
            onClick={fullscreen}
            className="absolute right-3 bottom-3 inline-flex min-h-11 items-center gap-2 bg-accent px-4 type-caps text-accent-ink sm:hidden"
          >
            <PlayIcon className="size-4" /> Play full screen
          </button>
        )}
        {expanded && aspect === "video" && (
          <p className="pointer-events-none absolute inset-x-0 bottom-6 hidden text-center type-label text-fog portrait:block">
            Turn your phone sideways to play bigger
          </p>
        )}
        {expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Close full screen"
            className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center bg-ink/80 text-paper hover:text-accent"
          >
            <CloseIcon className="size-[22px]" />
          </button>
        )}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 type-label whitespace-normal">
        <span className="text-ash">
          [ {status === "running" ? "Playing" : status} ] <span className="text-paper">{title}</span>
        </span>
        <span className="flex gap-4">
          <button
            type="button"
            onClick={restart}
            disabled={status === "blocked"}
            className="inline-flex min-h-6 items-center transition-colors hover:text-accent disabled:opacity-40 max-sm:min-h-11"
          >
            Restart
          </button>
          <button
            type="button"
            onClick={stop}
            disabled={status !== "running"}
            className="inline-flex min-h-6 items-center transition-colors hover:text-accent disabled:opacity-40 max-sm:min-h-11"
          >
            Stop
          </button>
          <button
            type="button"
            onClick={fullscreen}
            disabled={status !== "running"}
            className="inline-flex min-h-6 items-center transition-colors hover:text-accent disabled:opacity-40 max-sm:min-h-11"
          >
            Fullscreen
          </button>
        </span>
      </figcaption>
    </figure>
  );
}
