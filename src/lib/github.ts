import "server-only";
import { cacheLife } from "next/cache";

export type Level = 0 | 1 | 2 | 3 | 4;
export interface Day {
  date: string;
  count: number;
  level: Level;
}
export interface Contributions {
  total: number;
  weeks: Day[][];
  source: "graphql" | "public" | "fallback";
}

const LEVELS: Record<string, Level> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function viaGraphQL(user: string, token: string): Promise<Contributions | null> {
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: user } }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
          };
        };
      };
    };
  };
  const cal = json.data?.user?.contributionsCollection.contributionCalendar;
  if (!cal) return null;
  return {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) =>
      w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 })),
    ),
    source: "graphql",
  };
}

/** No token? GitHub's public contributions fragment has the same data. */
async function viaPublicPage(user: string): Promise<Contributions | null> {
  const res = await fetch(`https://github.com/users/${encodeURIComponent(user)}/contributions`, {
    headers: { "User-Agent": "portfolio-heatmap" },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const cells = new Map<string, { date: string; level: Level }>();
  for (const m of html.matchAll(/<td[^>]*?data-date="([\d-]+)"[^>]*?id="([^"]+)"[^>]*?data-level="(\d)"/g)) {
    cells.set(m[2], { date: m[1], level: Math.min(4, Number(m[3])) as Level });
  }
  if (!cells.size) return null;
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*?for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^(\d+) contribution/);
    counts.set(m[1], n ? Number(n[1]) : 0);
  }
  const days: Day[] = [...cells.entries()]
    .map(([id, c]) => ({ date: c.date, level: c.level, count: counts.get(id) ?? 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/i);
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : days.reduce((n, d) => n + d.count, 0);
  return { total, weeks: groupWeeks(days), source: "public" };
}

function groupWeeks(days: Day[]) {
  const weeks: Day[][] = [];
  let week: Day[] = [];
  for (const d of days) {
    const dow = new Date(`${d.date}T00:00:00Z`).getUTCDay();
    if (dow === 0 && week.length) {
      weeks.push(week);
      week = [];
    }
    week.push(d);
  }
  if (week.length) weeks.push(week);
  return weeks;
}

function fallback(): Contributions {
  return { total: 0, weeks: Array.from({ length: 53 }, () => []), source: "fallback" };
}

/**
 * Contribution calendar for the heatmap — cached and revalidated hourly.
 * GraphQL (GITHUB_TOKEN) → public contributions page → empty fallback.
 */
export async function getContributions(user: string): Promise<Contributions> {
  "use cache";
  cacheLife("hours");
  try {
    const token = process.env.GITHUB_TOKEN;
    const viaApi = token ? await viaGraphQL(user, token) : null;
    return viaApi ?? (await viaPublicPage(user)) ?? fallback();
  } catch {
    return fallback();
  }
}
