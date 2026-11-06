import "server-only";
import { cacheLife } from "next/cache";
import { codeToHtml, type ThemeRegistration } from "shiki";

/**
 * Two custom shiki themes built from the site palette, so code blocks match
 * the "IDE at night" / "paper blueprint" looks instead of a stock theme.
 * Highlighting runs on the server only — zero shiki bytes ship to the client.
 */
const night: ThemeRegistration = {
  name: "afnan-night",
  type: "dark",
  colors: { "editor.background": "#00000000", "editor.foreground": "#E5E7EB" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#5B6B85", fontStyle: "italic" } },
    { scope: ["keyword", "storage", "storage.type", "keyword.control"], settings: { foreground: "#8B5CF6" } },
    { scope: ["string", "string.quoted", "markup.inline.raw"], settings: { foreground: "#22C55E" } },
    { scope: ["constant.numeric", "constant.language", "constant.other"], settings: { foreground: "#F59E0B" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#22D3EE" } },
    { scope: ["entity.name.type", "support.type", "entity.name.class", "support.class"], settings: { foreground: "#67E8F9" } },
    { scope: ["variable.other.property", "meta.object-literal.key", "support.type.property-name", "entity.name.tag.yaml"], settings: { foreground: "#C4B5FD" } },
    { scope: ["entity.name.tag", "keyword.other.directive"], settings: { foreground: "#22D3EE" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: "#F59E0B" } },
    { scope: ["punctuation", "meta.brace"], settings: { foreground: "#94A3B8" } },
    { scope: ["variable", "variable.other"], settings: { foreground: "#E5E7EB" } },
  ],
};

const paper: ThemeRegistration = {
  name: "afnan-paper",
  type: "light",
  colors: { "editor.background": "#00000000", "editor.foreground": "#0F1D3D" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#6B7898", fontStyle: "italic" } },
    { scope: ["keyword", "storage", "storage.type", "keyword.control"], settings: { foreground: "#6D28D9" } },
    { scope: ["string", "string.quoted", "markup.inline.raw"], settings: { foreground: "#15803D" } },
    { scope: ["constant.numeric", "constant.language", "constant.other"], settings: { foreground: "#B45309" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#1D4ED8" } },
    { scope: ["entity.name.type", "support.type", "entity.name.class", "support.class"], settings: { foreground: "#0E7490" } },
    { scope: ["variable.other.property", "meta.object-literal.key", "support.type.property-name", "entity.name.tag.yaml"], settings: { foreground: "#5B21B6" } },
    { scope: ["entity.name.tag", "keyword.other.directive"], settings: { foreground: "#1D4ED8" } },
    { scope: ["entity.other.attribute-name"], settings: { foreground: "#B45309" } },
    { scope: ["punctuation", "meta.brace"], settings: { foreground: "#3C4A6B" } },
  ],
};

/** Cached forever per (code, lang) — the output only changes when the code does. */
export async function highlight(code: string, lang: string) {
  "use cache";
  cacheLife("max");
  try {
    return await codeToHtml(code, {
      lang,
      themes: { dark: night, light: paper },
      defaultColor: false,
    });
  } catch {
    // Unknown language → fall back to plain text rather than failing the page.
    return await codeToHtml(code, { lang: "text", themes: { dark: night, light: paper }, defaultColor: false });
  }
}
