/**
 * persona.ts — the three versions of the site and which one a visitor chose.
 *
 *   dev    → /               the developer portfolio (3D, terminal, code)
 *   hr     → /hr             the recruiter brief
 *   client → /work-with-me   the freelance / business page
 *
 * The choice lives in localStorage under `persona`. The root <head> script
 * reads it before first paint: a returning recruiter or client who lands on
 * "/" is sent straight to their version; a first-time visitor is asked.
 * Plain module (no "use client") so the inline script string can be imported
 * by the server layout.
 */
export type Persona = "dev" | "hr" | "client";

export const PERSONA_KEY = "persona";

export const personas: {
  id: Persona;
  href: string;
  label: string;
  who: string;
  blurb: string;
  key: string;
}[] = [
  {
    id: "dev",
    href: "/",
    label: "Developer",
    who: "a developer / tech lead",
    blurb: "The full portfolio: code, infrastructure, 3D and the details.",
    key: "1",
  },
  {
    id: "hr",
    href: "/hr",
    label: "Recruiter",
    who: "a recruiter / HR",
    blurb: "A one-page brief: experience, skills, availability and résumé.",
    key: "2",
  },
  {
    id: "client",
    href: "/work-with-me",
    label: "Client",
    who: "a business / client",
    blurb: "Services, process, pricing and how to start a project.",
    key: "3",
  },
];

export function setPersona(p: Persona) {
  try {
    localStorage.setItem(PERSONA_KEY, p);
  } catch {
    /* private mode — the choice just won't stick */
  }
}

/**
 * Pre-paint routing for "/". Runs inside the root layout's <head> script, so
 * it must only act on the home path. `?view=dev` (or any explicit view) always
 * wins and is remembered — handy for sharing the developer site with someone
 * whose last choice was a different version. Crawlers are never asked.
 */
export const personaScript = `(function(){try{if(location.pathname!=='/')return;var d=document.documentElement;var q=new URLSearchParams(location.search).get('view');var k='${PERSONA_KEY}';if(q==='dev'||q==='hr'||q==='client')localStorage.setItem(k,q);var p=localStorage.getItem(k);if(p==='hr'){d.classList.add('js-away');location.replace('/hr');return}if(p==='client'){d.classList.add('js-away');location.replace('/work-with-me');return}if(p!=='dev'&&!/bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent))d.classList.add('js-ask')}catch(e){}})();`;
