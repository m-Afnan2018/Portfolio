import { getContributions, type Level } from "@/lib/github";
import { profile } from "@/data/profile";
import { copy } from "@/data/copy";

const SHADE: Record<Level, string> = {
  0: "bg-text/[0.06]",
  1: "bg-primary/25",
  2: "bg-primary/50",
  3: "bg-primary/75",
  4: "bg-primary shadow-[0_0_6px_var(--primary)]",
};

function Frame({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="glass overflow-hidden rounded-[8px]">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-xs text-faint">
        <span>
          <span className="text-accent">$</span> gh api {copy.achievements.githubTitle}
        </span>
        <a href={profile.links.github} target="_blank" rel="noreferrer" className="hover:text-primary">
          @{profile.links.githubUser} ↗
        </a>
      </div>
      <div data-lenis-prevent className="no-scrollbar overflow-x-auto p-4 sm:p-5">
        {children}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2.5 font-mono text-[11px] text-faint">
        {footer}
      </div>
    </div>
  );
}

export function HeatmapSkeleton() {
  return (
    <Frame footer={<span>fetching contributions…</span>}>
      <div className="grid h-[104px] w-[720px] animate-pulse grid-flow-col grid-rows-7 gap-[3px]">
        {Array.from({ length: 53 * 7 }, (_, i) => (
          <span key={i} className="h-[11px] w-[11px] rounded-[2px] bg-text/[0.05]" />
        ))}
      </div>
    </Frame>
  );
}

/** Server component: contribution heatmap for the GitHub user in profile.ts. */
export async function GitHubHeatmap() {
  const data = await getContributions(profile.links.githubUser);
  const empty = data.source === "fallback";
  return (
    <Frame
      footer={
        <>
          <span>
            {empty ? (
              <span className="text-warn">stderr: couldn&apos;t reach GitHub — showing an empty calendar</span>
            ) : (
              <>
                <span className="text-text">{data.total.toLocaleString("en-IN")}</span> contributions in the last year
              </>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            less
            {([0, 1, 2, 3, 4] as Level[]).map((l) => (
              <span key={l} className={`h-[10px] w-[10px] rounded-[2px] ${SHADE[l]}`} />
            ))}
            more
          </span>
        </>
      }
    >
      <div className="flex w-max gap-[3px]" role="img" aria-label={`${data.total} GitHub contributions in the last year`}>
        {data.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {(week.length ? week : Array.from({ length: 7 }, () => null)).map((d, di) => (
              <span
                key={di}
                title={d ? `${d.count} contribution${d.count === 1 ? "" : "s"} on ${d.date}` : undefined}
                className={`h-[11px] w-[11px] rounded-[2px] ${SHADE[d?.level ?? 0]}`}
              />
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}
