import { defineConfig, presetUno, transformerDirectives } from "unocss";

const breakpoints = [375, 656, 960, 1280, 1440, 1536, 1920, 2560];

const colCalc = (span: number, includeGutter = false) => {
  if (span < 1 || span > 12) return;

  return `calc((${span} * ((100dvw - (2 * var(--layout-margin)) - (11 * var(--layout-gutter))) / 12)) + (${includeGutter ? span : span - 1} * var(--layout-gutter)))`;
};

const spacingRules = [
  ["w", "width", false],
  ["min-w", "min-width", false],
  ["max-w", "max-width", false],
  ["gap", "gap", false],
  ["m", "margin", true],
  ["mx", "margin-inline", true],
  ["my", "margin-block", true],
  ["ml", "margin-left", true],
  ["mr", "margin-right", true],
  ["mt", "margin-top", true],
  ["mb", "margin-bottom", true],
  ["p", "padding", true],
  ["px", "padding-inline", true],
  ["py", "padding-block", true],
  ["pl", "padding-left", true],
  ["pr", "padding-right", true],
  ["pt", "padding-top", true],
  ["pb", "padding-bottom", true],
] as const;
const keywordMap: Record<string, string> = {
  gutter: "var(--layout-gutter)",
  layoutMargin: "var(--layout-margin)",
};
const keywordPattern = Object.keys(keywordMap).join("|");

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerDirectives()],
  rules: [
    ...spacingRules.map(([prefix, property, includeGutter]) => [
      new RegExp(`^${prefix}-(\\d+)col$`),
      ([, d]) => {
        const span = Number(d);
        const value = colCalc(span, includeGutter);
        if (!value) return;
        return { [property]: value };
      },
    ]),
    ...spacingRules.map(([prefix, property]) => [
      new RegExp(`^${prefix}-(${keywordPattern})$`),
      ([, keyword]: [string, string]) => ({ [property]: keywordMap[keyword] }),
    ]),
  ],
  safelist: [
    ...spacingRules.flatMap(([prefix]) => [
      ...Array.from({ length: 12 }, (_, i) => `${prefix}-${i + 1}col`),
      ...Object.keys(keywordMap).map((keyword) => `${prefix}-${keyword}`),
    ]),
  ],
  theme: {
    fontFamily: {
      inter: "Inter",
      geist: "Geist",
      soria: "Soria",
    },
    colors: {
      accent1: "#E77239",
      accent2: "#A86062",
      accent3: "#6E43FE",
      accent4: "#5F7C9A",
      accent5: "#EC3828",
      text: "#2E2E2E",
      lightText: "#5C5C5C",
      whiteText: "#FFFFFF",
      background: "#F3F3F2",
    },
  },
  variants: [
    // Min-width variants
    (matcher) => {
      // Sort descending so bigger breakpoints have higher priority
      for (const bp of [...breakpoints].sort((a, b) => b - a)) {
        const regex = new RegExp(`^>=${bp}:(.*)$`);
        const match = matcher.match(regex);
        if (match) {
          return {
            matcher: match[1],
            parent: `@media (min-width: ${bp}px)`,
            sort: bp, // bigger breakpoint → higher sort → later in CSS → overrides smaller ones
          };
        }
      }
    },

    // Max-width variants
    (matcher) => {
      for (const bp of [...breakpoints].sort((a, b) => a - b)) {
        const regex = new RegExp(`^<=${bp}:(.*)$`);
        const match = matcher.match(regex);
        if (match) {
          return {
            matcher: match[1],
            parent: `@media (max-width: ${bp}px)`,
            sort: -bp, // smaller max-width → higher priority
          };
        }
      }
    },
  ],
});
