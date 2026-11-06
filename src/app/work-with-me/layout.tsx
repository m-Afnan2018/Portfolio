import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./clients.css";

// A warmer, friendlier voice than the developer site or the recruiter brief:
// Bricolage Grotesque for headlines, Inter for reading.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-cl-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-cl-body",
  display: "swap",
});

/**
 * Runs before first paint: hides animated content only when motion is allowed
 * (so GSAP can reveal it without a flash), decides whether the one-per-session
 * intro curtain plays, and un-hides everything after 4s if JS never arrives.
 */
const motionGate = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('cl-anim');if(!sessionStorage.getItem('cl-intro'))d.classList.add('cl-intro');setTimeout(function(){d.classList.add('cl-done');d.classList.remove('cl-intro')},4000)}catch(e){}})();`;

/** /work-with-me — for business owners hiring a freelancer. */
export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`cl-root ${display.variable} ${body.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: motionGate }} />
      {children}
    </div>
  );
}
