"use client";

import { useEffect } from "react";
import { setPersona, type Persona } from "@/lib/persona";
import { releaseHandoff } from "@/lib/handoff";

/**
 * Viewing a version = choosing it, however the visitor arrived (shared link,
 * footer link, back button). Skipped while the "who's visiting?" gate is up on
 * "/" (the gate decides) and while a returning visitor is being redirected.
 */
export function usePersonaMark(current: Persona) {
  useAwayTitle(AWAY[current]);
  useEffect(() => {
    const html = document.documentElement.classList;
    if (!html.contains("js-ask") && !html.contains("js-away")) setPersona(current);
    // arriving from another version: lift the shared hand-off frame
    releaseHandoff();
  }, [current]);
}

/** what the browser tab says while the visitor is on another tab */
const AWAY: Record<Persona, string> = {
  dev: "</> Come back — the build is still warm",
  hr: "📄 Still shortlisting? Come back",
  client: "👋 Your project is waiting",
};

/**
 * Swap the tab title while the page is hidden; on return say hello, then put
 * the real title back.
 */
export function useAwayTitle(message: string) {
  useEffect(() => {
    let real = document.title;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onChange = () => {
      clearTimeout(timer);
      if (document.hidden) {
        if (document.title !== message) real = document.title;
        document.title = message;
      } else {
        document.title = "✨ Welcome back!";
        timer = setTimeout(() => (document.title = real), 1600);
      }
    };
    document.addEventListener("visibilitychange", onChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onChange);
      if (document.title === message || document.title.startsWith("✨")) document.title = real;
    };
  }, [message]);
}
