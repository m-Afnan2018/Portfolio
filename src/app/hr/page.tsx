/**
 * /hr — the recruiter brief.
 *
 * Same person, different reader. The developer site is an experience; this
 * page is a document: the answers a recruiter or hiring manager needs in the
 * first 30 seconds (who, what level, which stack, proof, availability, how to
 * reach), in the order they look for them. Contact stays pinned on the left;
 * it prints cleanly to a PDF. All content comes from src/data/*.
 */
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { profile, achievements } from "@/data/profile";
import { hrGraph, ldJson } from "@/lib/seo";
import { experience } from "@/data/experience";
import { BrandMark } from "@/components/brand/BrandMark";
import { Signature } from "@/components/brand/Signature";
import { skillGroups } from "@/data/skills";
import { projects } from "@/data/projects";
import { hr, coreSkills, skillDisplayName, skillGroupName } from "@/data/hr";
import { CopyEmailButton, LocalTime, PrintButton } from "@/components/hr/HrClient";
import { HrContactForm } from "@/components/hr/HrContactForm";
import { HrVersionSwitch } from "@/components/hr/HrVersionSwitch";

const hrDescription = `${profile.name} — ${profile.title}. Experience, skills, projects and availability at a glance.`;

export const metadata: Metadata = {
  title: "Recruiter brief",
  description: hrDescription,
  keywords: [
    `${profile.name} resume`,
    `${profile.name} CV`,
    "Full Stack Developer resume",
    "DevOps Engineer India",
    "hire Next.js developer",
    "MERN developer",
  ],
  alternates: { canonical: "/hr" },
  openGraph: {
    type: "profile",
    url: "/hr",
    title: `${profile.name} — Recruiter brief`,
    description: hrDescription,
    siteName: `${profile.name} — portfolio`,
    locale: "en_IN",
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.links.githubUser,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Recruiter brief`,
    description: hrDescription,
    site: profile.links.twitterHandle,
    creator: profile.links.twitterHandle,
  },
};

// ── time maths (cached daily, so the page stays static) ─────────────────────
const toIndex = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
const span = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return (
    [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`]
      .filter(Boolean)
      .join(" ") || "< 1 mo"
  );
};

async function getTimeline() {
  "use cache";
  cacheLife("days");
  const now = new Date();
  const nowIdx = now.getFullYear() * 12 + now.getMonth();
  // jobs are newest-first: a job ends where the newer one starts
  const durations = experience.map((job, i) => {
    const end = job.current || i === 0 ? nowIdx : toIndex(experience[i - 1].start);
    return span(end - toIndex(job.start) + 1);
  });
  const totalMonths = nowIdx - toIndex(experience[experience.length - 1].start) + 1;
  return { durations, totalYears: Math.max(1, Math.floor(totalMonths / 12)) };
}

/** bold the numbers in a sentence — recruiters scan for them */
function Emphasise({ text }: { text: string }) {
  const parts = text.split(/((?<![A-Za-z])\d[\d,.]*(?:%|\+)?)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\d/.test(p) && i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[var(--hr-ink)]">
            {p}
          </strong>
        ) : (
          p
        ),
      )}
    </>
  );
}

const SECTIONS = 6;

/** title left, "02 / 07" right, one ink rule under both */
function SectionHead({ n, title, id }: { n: number; title: string; id: string }) {
  return (
    <div className="hr-head">
      <h2 id={id} className="hr-display text-[clamp(1.45rem,2.2vw,1.8rem)] leading-tight">
        {title}
      </h2>
      <span className="hr-label" aria-hidden>
        {String(n).padStart(2, "0")} / {String(SECTIONS).padStart(2, "0")}
      </span>
    </div>
  );
}

/** in-page jump links for the top bar */
const NAV = [
  { href: "#hr-experience", label: "Experience" },
  { href: "#hr-skills", label: "Skills" },
  { href: "#hr-projects", label: "Work" },
  { href: "#hr-contact", label: "Contact" },
];

const hasLink = (url: string) => !url.includes("TODO");

export default async function HrPage() {
  const { durations, totalYears } = await getTimeline();
  const realProjects = projects.filter((p) => !p.placeholder);
  const current = experience.find((j) => j.current) ?? experience[0];

  // everything a recruiter needs to qualify a call, in one place (the card)
  const logistic = (label: string) => hr.logistics.find((l) => l.label === label)?.value;
  const quickFacts = [
    { label: "Current role", value: `${current.role}, ${current.company}` },
    { label: "Based in", value: `${profile.location} · ${profile.timezoneLabel}` },
    { label: "Work mode", value: logistic("Work mode") },
    { label: "Notice period", value: logistic("Notice period") },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  const stats = [
    { value: `${totalYears}+`, label: "years building production software" },
    ...achievements
      .filter((a) => a.label !== "Codeforces max rating")
      .map((a) => ({ value: `${a.value.toLocaleString("en-US")}${a.suffix}`, label: a.label })),
  ].slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(hrGraph()) }} />
      <a
        href="#hr-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[var(--hr-ink)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* ── top bar ── */}
      <header className="hr-noprint sticky top-0 z-40 border-b border-[var(--hr-rule)] bg-[color-mix(in_srgb,var(--hr-paper)_85%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#hr-main" className="group flex min-w-0 items-center gap-3">
            <BrandMark size={28} draw />
            <span className="truncate text-sm">
              <span className="font-semibold">{profile.name}</span>
              <span className="hidden text-[var(--hr-muted)] sm:inline"> — Recruiter brief</span>
            </span>
          </a>
          <nav className="hr-nav hidden items-center gap-6 text-sm lg:flex" aria-label="Sections">
            {NAV.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1 text-sm sm:gap-3">
            <PrintButton className="hr-link hidden text-[var(--hr-ink-2)] md:inline" />
            <HrVersionSwitch />
          </div>
        </div>
      </header>

      <div className="hr-page mx-auto grid max-w-[1240px] gap-12 px-5 pt-10 pb-24 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:pt-16">
        {/* ── identity card (sticky) ── */}
        <aside
          className="hr-aside lg:sticky lg:top-24 lg:col-span-4 lg:self-start"
          aria-label="Contact summary"
        >
          <div className="hr-card p-6 sm:p-7">
            <div className="group flex items-center gap-4">
              <span className="hr-mono h-14 w-14 shrink-0">
                <BrandMark size={34} tile={false} draw />
              </span>
              <div>
                <p className="hr-display text-[22px] leading-tight">{profile.name}</p>
                <p className="mt-1 text-sm text-[var(--hr-muted)]">{profile.shortTitle}</p>
              </div>
            </div>

            <p className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[var(--hr-ok-soft)] px-3 py-1.5 text-[13px] font-medium text-[var(--hr-ok)]">
              <span className="relative flex h-2 w-2">
                <span className="hr-pulse absolute inset-0 rounded-full bg-[var(--hr-ok)]" />
                <span className="relative h-2 w-2 rounded-full bg-[var(--hr-ok)]" />
              </span>
              {logistic("Availability")}
            </p>

            <dl className="mt-6 space-y-3.5 text-sm">
              {quickFacts.map((f) => (
                <div key={f.label} className="grid grid-cols-[96px_1fr] gap-3">
                  <dt className="text-[var(--hr-muted)]">{f.label}</dt>
                  <dd className="text-[var(--hr-ink)]">{f.value}</dd>
                </div>
              ))}
              <div className="hr-noprint grid grid-cols-[96px_1fr] gap-3">
                <dt className="text-[var(--hr-muted)]">Local time</dt>
                <dd>
                  <LocalTime />
                </dd>
              </div>
            </dl>

            <div className="hr-noprint mt-7 grid gap-2.5">
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Opportunity for ${profile.name}`)}`}
                className="hr-btn hr-btn-primary w-full"
              >
                Email {profile.firstName}
              </a>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="hr-btn hr-btn-ghost"
                >
                  Résumé PDF
                </a>
                <CopyEmailButton className="hr-btn hr-btn-ghost" />
              </div>
            </div>

            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-[var(--hr-rule)] pt-5 text-sm">
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="hr-link">
                GitHub ↗
              </a>
              {hasLink(profile.links.linkedin) && (
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hr-link"
                >
                  LinkedIn ↗
                </a>
              )}
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="hr-link">
                {profile.phone}
              </a>
              {/* print shows the address the buttons hide */}
              <span className="hidden print:inline">{profile.email}</span>
            </p>
          </div>
        </aside>

        {/* ── the brief ── */}
        <main id="hr-main" className="hr-main min-w-0 space-y-20 lg:col-span-8">
          {/* summary */}
          <section aria-labelledby="hr-summary" className="hr-avoid">
            <p id="hr-summary" className="hr-label mb-5">
              {profile.title}
            </p>
            <h1 className="hr-display max-w-[18ch] text-[clamp(2.1rem,3.8vw,3.1rem)] leading-[1.1]">
              {hr.headline.replace(hr.headlineAccent, "")}
              <span className="text-[var(--hr-accent)]">{hr.headlineAccent}</span>
            </h1>
            <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-[var(--hr-ink-2)]">
              {hr.intro}
            </p>

            <p className="mt-5 text-sm text-[var(--hr-muted)]">
              <span className="text-[var(--hr-ink)]">Fits roles as</span> {hr.roleFit.join(" · ")}
            </p>

            {/* numbers as a plain ruled row, read left to right like a résumé */}
            <dl className="mt-10 grid grid-cols-2 border-y border-[var(--hr-rule-strong)] sm:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col-reverse justify-end py-5 pr-4 ${i > 0 ? "sm:border-l sm:border-[var(--hr-rule)] sm:pl-5" : ""} ${i % 2 ? "border-l border-[var(--hr-rule)] pl-5" : ""} ${i > 1 ? "border-t border-[var(--hr-rule)] sm:border-t-0" : ""}`}
                >
                  <dt className="mt-2 text-[13px] leading-snug text-[var(--hr-muted)]">
                    {s.label}
                  </dt>
                  <dd className="hr-display text-[30px] leading-none tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* strengths */}
          <section aria-labelledby="hr-strengths" className="hr-reveal">
            <SectionHead n={1} title="What I bring" id="hr-strengths" />
            {/* three plain columns split by hairlines — no cards, no inner numbering */}
            <div className="hr-strengths grid divide-y divide-[var(--hr-rule)] md:grid-cols-3 md:divide-x md:divide-y-0">
              {hr.strengths.map((s) => (
                <article
                  key={s.title}
                  className="hr-avoid py-6 first:pt-0 last:pb-0 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0"
                >
                  <h3 className="text-[17px] leading-snug font-semibold">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--hr-ink-2)]">
                    {s.body}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-sm text-[var(--hr-muted)]">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span aria-hidden className="text-[var(--hr-accent)]">
                          +
                        </span>
                        <span>
                          <Emphasise text={p} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* experience */}
          <section aria-labelledby="hr-experience" className="hr-reveal">
            <SectionHead n={2} title="Experience" id="hr-experience" />
            {/* résumé layout: dates in a narrow left column, the job on the right */}
            <ol className="divide-y divide-[var(--hr-rule)]">
              {experience.map((job, i) => (
                <li
                  key={job.company}
                  className="hr-avoid grid gap-x-8 gap-y-3 py-8 first:pt-0 last:pb-0 sm:grid-cols-[176px_1fr]"
                >
                  <div className="text-sm text-[var(--hr-muted)]">
                    <p className="whitespace-nowrap text-[var(--hr-ink)] tabular-nums">
                      {job.period}
                    </p>
                    <p className="mt-0.5">
                      {durations[i]} · {job.mode}
                    </p>
                    {job.current && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--hr-accent)]">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
                        Current role
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[18px] leading-snug font-semibold">{job.role}</h3>
                    <p className="mt-0.5 text-[15px] text-[var(--hr-ink-2)]">{job.company}</p>
                    <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-[var(--hr-ink-2)]">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span aria-hidden className="text-[var(--hr-muted)]">
                            —
                          </span>
                          <span>
                            <Emphasise text={b} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* skills */}
          <section aria-labelledby="hr-skills" className="hr-reveal">
            <SectionHead n={3} title="Skills" id="hr-skills" />
            {/* the stack used every day, as one scannable line */}
            <div className="hr-avoid">
              <p className="hr-label">Core stack · used day to day</p>
              <ul className="mt-3 flex flex-wrap gap-y-1 text-[18px] leading-relaxed font-medium text-[var(--hr-ink)]">
                {coreSkills.map((name, i) => (
                  <li key={name} className="whitespace-nowrap">
                    {skillDisplayName[name] ?? name}
                    {i < coreSkills.length - 1 && (
                      <span aria-hidden className="mx-2.5 text-[var(--hr-rule-strong)]">
                        /
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* everything else, grouped — plain text, no pills */}
            <dl className="mt-10 grid gap-x-10 border-t border-[var(--hr-rule)] sm:grid-cols-2">
              {skillGroups.map((g) => (
                <div key={g.id} className="hr-avoid border-b border-[var(--hr-rule)] py-4">
                  <dt className="text-sm font-semibold">{skillGroupName[g.id] ?? g.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-[var(--hr-muted)]">
                    {g.skills.map((s, i) => (
                      <span key={s.name}>
                        {i > 0 && ", "}
                        <span className={coreSkills.includes(s.name) ? "text-[var(--hr-ink)]" : ""}>
                          {skillDisplayName[s.name] ?? s.name}
                        </span>
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* projects */}
          <section aria-labelledby="hr-projects" className="hr-reveal">
            <SectionHead n={4} title="Selected work" id="hr-projects" />
            {/* same résumé rhythm as Experience: meta left, the work right */}
            <div className="divide-y divide-[var(--hr-rule)]">
              {realProjects.map((p) => (
                <article
                  key={p.slug}
                  className="hr-avoid grid gap-x-8 gap-y-3 py-8 first:pt-0 sm:grid-cols-[176px_1fr]"
                >
                  <div className="flex items-baseline justify-between gap-4 text-sm sm:block">
                    <p className="text-[var(--hr-ink)] tabular-nums">{p.year}</p>
                    <div className="hr-noprint flex gap-4 font-medium sm:mt-2">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hr-link text-[var(--hr-accent)]"
                        >
                          Live ↗
                        </a>
                      )}
                      {p.repoUrl && (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hr-link text-[var(--hr-accent)]"
                        >
                          {p.repoUrl.includes("/pull/") ? "Contribution ↗" : "Code ↗"}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[18px] leading-snug font-semibold">{p.title}</h3>
                    <p className="mt-0.5 text-[15px] text-[var(--hr-ink-2)]">{p.tagline}</p>
                    <ul className="mt-3 space-y-1.5 text-sm text-[var(--hr-muted)]">
                      {p.highlights.slice(0, 3).map((h) => (
                        <li key={h} className="flex gap-2">
                          <span aria-hidden className="text-[var(--hr-accent)]">
                            +
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[13px] text-[var(--hr-muted)]">
                      <span className="text-[var(--hr-ink-2)]">Stack</span> {p.stack.join(" · ")}
                    </p>
                  </div>
                </article>
              ))}
              {/* client work as a real entry, not a footnote */}
              <article className="hr-avoid grid gap-x-8 gap-y-3 pt-8 sm:grid-cols-[176px_1fr]">
                <p className="text-sm text-[var(--hr-ink)]">Ongoing</p>
                <div>
                  <h3 className="text-[18px] leading-snug font-semibold">Client websites</h3>
                  <p className="mt-0.5 text-[15px] text-[var(--hr-ink-2)]">
                    <Emphasise text="20+ live client sites built, deployed and maintained end to end. Client work — details on request." />
                  </p>
                </div>
              </article>
            </div>
          </section>

          {/* education & recognition */}
          <section aria-labelledby="hr-education" className="hr-reveal">
            <SectionHead n={5} title="Education & recognition" id="hr-education" />
            {/* same two-column rhythm: dates or numbers left, detail right */}
            <ul className="divide-y divide-[var(--hr-rule)]">
              {profile.education.map((e) => (
                <li
                  key={e.degree}
                  className="hr-avoid grid gap-x-8 gap-y-1 py-5 first:pt-0 sm:grid-cols-[176px_1fr]"
                >
                  <p className="text-sm whitespace-nowrap text-[var(--hr-ink)] tabular-nums">
                    {e.period}
                  </p>
                  <div>
                    <h3 className="text-[17px] leading-snug font-semibold">{e.degree}</h3>
                    <p className="mt-0.5 text-[15px] text-[var(--hr-ink-2)]">{e.school}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="hr-label mt-10 mb-1">Problem solving</p>
            <ul className="divide-y divide-[var(--hr-rule)] border-t border-[var(--hr-rule)]">
              {achievements
                .filter((a) => /DSA|Codeforces/.test(a.label))
                .map((a) => (
                  <li
                    key={a.label}
                    className="hr-avoid grid items-baseline gap-x-8 gap-y-1 py-5 sm:grid-cols-[176px_1fr]"
                  >
                    <p className="hr-display text-[26px] leading-none tabular-nums">
                      {a.value.toLocaleString("en-US")}
                      {a.suffix}
                    </p>
                    <div>
                      <p className="text-[15px] font-medium first-letter:uppercase">{a.label}</p>
                      <p className="mt-0.5 text-sm text-[var(--hr-muted)]">{a.detail}</p>
                      {a.proof && (
                        <p className="hr-noprint mt-2 flex flex-wrap gap-x-4 text-sm font-medium">
                          {a.proof.map((l) => (
                            <a
                              key={l.href}
                              href={l.href}
                              target="_blank"
                              rel="noreferrer"
                              className="hr-link text-[var(--hr-accent)]"
                            >
                              {l.label} ↗
                            </a>
                          ))}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </section>

          {/* contact */}
          <section aria-labelledby="hr-contact" className="hr-reveal hr-noprint">
            <SectionHead n={SECTIONS} title="Get in touch" id="hr-contact" />
            <p className="text-[15px] text-[var(--hr-ink-2)]">{hr.contactLead}</p>
            {/* the address itself, once, big enough to read off a screen share */}
            <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Opportunity for ${profile.name}`)}`}
                className="hr-display hr-link text-[clamp(1.3rem,2.6vw,1.9rem)] break-all text-[var(--hr-accent)]"
              >
                {profile.email}
              </a>
              <CopyEmailButton className="hr-link text-sm text-[var(--hr-muted)] hover:text-[var(--hr-ink)]" />
            </div>

            <p className="hr-label mt-12 mb-5">Or leave a note here</p>
            <HrContactForm />
          </section>

          <footer className="hr-noprint border-t border-[var(--hr-rule)] pt-6">
            <Signature current="hr" className="text-[var(--hr-ink)]" />
          </footer>
        </main>
      </div>
    </>
  );
}
