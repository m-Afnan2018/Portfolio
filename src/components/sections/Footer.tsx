"use client";

import { useEffect, useState } from "react";
import { profile, techMarquee } from "@/data/profile";
import { copy } from "@/data/copy";
import { Marquee } from "@/components/ui/Marquee";
import { Signature } from "@/components/brand/Signature";

function IstTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { timeZone: profile.timezone, hour: "2-digit", minute: "2-digit", hour12: true });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--"}</span>;
}

export function Footer() {
  return (
    <footer className="relative border-t border-line pb-12 pt-6 lg:pl-[60px]" aria-label="Site footer">
      <Marquee items={techMarquee} className="font-display text-[clamp(2.5rem,7vw,7rem)] font-bold leading-none tracking-[-0.04em] text-text/90" />
      <div className="mt-10 grid gap-10 px-[5vw] font-mono text-xs text-muted md:grid-cols-12 xl:pr-[calc(5vw+56px)]">
        <div className="md:col-span-5">
          <p className="text-text">{copy.footer.built}</p>
          <p className="mt-2">© 2026 {profile.name}</p>
          <a href={profile.links.source} target="_blank" rel="noreferrer" className="mt-4 inline-block text-primary hover:underline">
            {"</>"} view source
          </a>
          <a href="/hr" className="ml-5 mt-4 inline-block text-primary hover:underline">
            → recruiter brief (/hr)
          </a>
          <a href="/work-with-me" className="ml-5 mt-4 inline-block text-primary hover:underline">
            → hire me for a project
          </a>
        </div>
        <div className="md:col-span-3">
          <p className="t-label mb-3">local time</p>
          <p className="text-text">
            <IstTime /> {profile.timezoneLabel} · {profile.location}
          </p>
          <p className="t-label mb-3 mt-6">currently building</p>
          <p className="text-text">
            <span className="text-warn">●</span> {profile.currentlyBuilding}
          </p>
        </div>
        <div className="md:col-span-4">
          <p className="t-label mb-3">changelog</p>
          <ul className="space-y-1.5">
            {profile.changelog.map((c) => (
              <li key={c.version}>
                <span className="text-accent">{c.version}</span> — {c.note}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-[5vw] mt-12 border-t border-line pt-6 text-text xl:mr-[calc(5vw+56px)]">
        <Signature current="dev" />
      </div>
    </footer>
  );
}
