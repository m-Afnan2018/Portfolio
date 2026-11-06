import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./hr.css";

// Clean, professional pairing for the recruiter brief — distinct from the
// developer site's grotesk + mono. Jakarta for headings, Inter for reading.
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-hr-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-hr-body",
  display: "swap",
});

/** /hr — the recruiter brief. No 3D, no loader, no custom cursor: just the facts. */
export default function HrLayout({ children }: { children: React.ReactNode }) {
  return <div className={`hr-root ${display.variable} ${body.variable}`}>{children}</div>;
}
