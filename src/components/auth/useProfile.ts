"use client";

import { useCallback, useEffect, useState } from "react";

import type { Profile } from "@/lib/domain/types";
import { browserRepos } from "@/lib/repos";

const EVENT = "pm:session";

/** Tell every mounted useProfile() hook that the session changed (sign in or out). */
export function announceSessionChange() {
  window.dispatchEvent(new Event(EVENT));
}

/**
 * The signed-in profile from the mock auth repository, or null. `ready` is false until the
 * browser has been checked, so pages can avoid flashing the signed-out state.
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const refresh = () => {
      void browserRepos()
        .auth.getCurrentProfile()
        .then((next) => {
          if (!alive) return;
          setProfile(next);
          setReady(true);
        });
    };
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      alive = false;
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const signOut = useCallback(async () => {
    await browserRepos().auth.signOut();
    announceSessionChange();
  }, []);

  return { profile, ready, signOut };
}
