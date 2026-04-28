import { defineConfig, presetUno, transformerDirectives } from "unocss";

const breakpointList = [375, 656, 960, 1280, 1440, 1536, 1920, 2560];

const breakpoints = Object.fromEntries(
  breakpointList.map((bp) => [`bp${bp}`, `${bp}px`]),
);

const colCalc = (span: number, includeGutter = false) => {
  return `calc((${span} * var(--layout-column)) + (${includeGutter ? span : span - 1} * var(--layout-gutter)))`;
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
  ["left", "left", true],
  ["right", "right", true],
] as const;

const keywordMap: Record<string, string> = {
  gutter: "var(--layout-gutter)",
  layoutMargin: "var(--layout-margin)",
};
const keywordPattern = Object.keys(keywordMap).join("|");

const sizeMap: Record<string, string> = {
  "3xs": "14px",
  "2xs": "16px",
  xs: "28px",
  s: "32px",
  m: "48px",
  l: "78px",
  xl: "128px",
  margin: "var(--layout-margin)",
  gutter: "var(--layout-gutter)",
};
const sizePattern = Object.keys(sizeMap).join("|");

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
    ...spacingRules.map(([prefix, property]) => [
      new RegExp(`^${prefix}-(${sizePattern})$`),
      ([, size]: [string, string]) => ({ [property]: sizeMap[size] }),
    ]),
  ],
  safelist: [
    ...spacingRules.flatMap(([prefix]) => [
      ...Array.from({ length: 12 }, (_, i) => `${prefix}-${i + 1}col`),
      ...Object.keys(keywordMap).map((keyword) => `${prefix}-${keyword}`),
      ...Object.keys(sizeMap).map((size) => `${prefix}-${size}`),
    ]),
  ],
  theme: {
    breakpoints,
    fontFamily: {
      display: "var(--font-display)",
      body: "var(--font-body)",
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
  shortcuts: {
    // Headings — scale between 375px and 1440px viewport
    "text-heading-0":
      "font-display font-black text-[clamp(2.75rem,1.997rem+3.21vw,4.375rem)] leading-[1.05]", // 44 → 70
    "text-heading-1":
      "font-display font-semibold text-[clamp(2.5rem,1.638rem+3.68vw,4.5rem)] leading-[1.05]", // 40 → 72
    "text-heading-2":
      "font-display font-semibold text-[clamp(2rem,1.46rem+2.3vw,3rem)] leading-[1.1]", // 32 → 48
    "text-heading-3":
      "font-display font-semibold text-[clamp(1.625rem,1.397rem+0.972vw,2.25rem)] leading-[1.15]", // 26 → 36
    "text-heading-4":
      "font-display font-semibold text-[clamp(1.25rem,1.14rem+0.46vw,1.6rem)] leading-[1.2]", // 20 → 24
    "text-heading-5": "font-display font-semibold text-[1rem] leading-[1.3]", // 16 (fixed)

    // Body — normal weights
    "text-2xs-400":
      "font-body font-normal text-[clamp(0.8125rem,0.787rem+0.108vw,0.875rem)] leading-[1.5]", // 13 → 14
    "text-xs-400":
      "font-body font-normal text-[clamp(1rem,0.95rem+0.215vw,1.125rem)] leading-[1.5]", // 16 → 18
    "text-s-400":
      "font-body font-normal text-[clamp(1.125rem,1.02rem+0.43vw,1.375rem)] leading-[1.5]", // 18 → 22
    "text-m-400":
      "font-body font-normal text-[clamp(1.25rem,1.04rem+0.92vw,1.5rem)] leading-[1.4]", // 20 → 24
    "text-l-400":
      "font-body font-normal text-[clamp(1.375rem,1.139rem+1.0vw,1.75rem)] leading-[1.35]", // 22 → 28
    "text-xl-400":
      "font-body font-normal text-[clamp(1.5rem,1.215rem+1.215vw,2rem)] leading-[1.3]", // 24 → 32
    "text-2xl-400":
      "font-body font-normal text-[clamp(1.75rem,1.357rem+1.682vw,2.5rem)] leading-[1.25]", // 28 → 40

    // Body — bold weights (same sizes as 400)
    "text-xs-700":
      "font-body font-bold text-[clamp(1rem,0.95rem+0.215vw,1.125rem)] leading-[1.5]",
    "text-s-700":
      "font-body font-bold text-[clamp(1.125rem,1.02rem+0.43vw,1.375rem)] leading-[1.5]",
    "text-m-700":
      "font-body font-bold text-[clamp(1.25rem,1.04rem+0.92vw,1.5rem)] leading-[1.4]",
    "text-l-700":
      "font-body font-bold text-[clamp(1.375rem,1.139rem+1.0vw,1.75rem)] leading-[1.4]",
    "text-xl-700":
      "font-body font-bold text-[clamp(1.5rem,1.215rem+1.215vw,2rem)] leading-[1.4]",
    "text-2xl-700":
      "font-body font-bold text-[clamp(1.75rem,1.357rem+1.682vw,2.5rem)] leading-[1.4]",
  },
  variants: [
    // >=NNN: → rewrites to bpNNN: so UnoCSS's native breakpoint handler picks it up
    (matcher) => {
      const match = matcher.match(/^>=(\d+):(.*)$/);
      if (!match) return;
      const [, bp, rest] = match;
      if (!breakpointList.includes(Number(bp))) return;
      return { matcher: `bp${bp}:${rest}` };
    },
    // <=NNN: → rewrites to <bpNNN: (UnoCSS's built-in max-width prefix)
    (matcher) => {
      const match = matcher.match(/^<=(\d+):(.*)$/);
      if (!match) return;
      const [, bp, rest] = match;
      if (!breakpointList.includes(Number(bp))) return;
      return { matcher: `<bp${bp}:${rest}` };
    },
  ],
});
