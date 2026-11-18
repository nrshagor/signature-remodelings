// Fails the build if the built site uses CSS that browsers inside the support target
// (.browserslistrc: Safari/iOS 15.4+, Chrome/Edge 109+, Firefox 102+, Samsung Internet 17+)
// would drop without a fallback. Runs after `next build`. No dependencies: a small CSS
// walker plus one rule per feature. Adapted from the solum-constructions check for plain
// CSS (CSS Modules + globals.css). If the target changes, review these rules too.
//
//  1. Modern colour functions (color-mix, oklab, oklch, lab, lch) need a plain declaration
//     of the same property for the same selector (Chrome < 111, Safari < 16.2, Firefox < 113).
//  2. Gradient colour interpolation (`to top in oklab`) needs an override inside
//     @supports not (background-image: linear-gradient(in oklab, …))
//     (Chrome < 111, Safari < 16.2, Firefox < 127 drop the whole gradient).
//  3. svh/dvh/lvh need a vh fallback, before them in the same rule or inside
//     @supports not (height: 1svh) (Samsung Internet < 21).
//  4. :has() needs a rule for the same base selector inside
//     @supports not selector(:has(*)) (Firefox < 121).
//  5. backdrop-filter needs -webkit-backdrop-filter in the same rule (Safari < 18).
//  6. Native CSS nesting left in the output (Chrome < 112, Safari < 16.5, Firefox < 117).
//  7. Container queries (@container) are not allowed (Safari < 16, Firefox < 110).
//  8. Inline styles in the prerendered HTML or client JS using modern colour functions:
//     inline styles can't carry a fallback. Use a CSS class instead.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const next = fileURLToPath(new URL("../.next/", import.meta.url));
const chunksDir = join(next, "static", "chunks");
const pagesDir = join(next, "server", "app");

const walk = (dir, ext) =>
  existsSync(dir)
    ? readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? walk(path, ext) : name.endsWith(ext) ? [path] : [];
      })
    : [];

/** Rules with their enclosing at-rules: [{ sel, ctx: string[], decls: [prop, value][] }]. */
function parse(css) {
  const rules = [];
  const stack = [];
  let buf = "";
  let quote = null;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (quote) {
      buf += c;
      if (c === quote && css[i - 1] !== "\\") quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      buf += c;
      continue;
    }
    if (c === "/" && css[i + 1] === "*") {
      i = css.indexOf("*/", i + 2) + 1;
      continue;
    }
    if (c === "{") {
      stack.push(buf.trim());
      buf = "";
      continue;
    }
    if (c === "}") {
      const sel = stack.pop() ?? "";
      if (buf.trim() && !sel.startsWith("@")) rules.push({ sel, ctx: [...stack], decls: declarations(buf) });
      buf = "";
      continue;
    }
    if (c === ";" && (stack.length === 0 || stack.at(-1).startsWith("@"))) {
      buf = ""; // statement at-rule, e.g. @import or @layer a, b;
      continue;
    }
    buf += c;
  }
  return rules;
}

function declarations(block) {
  const out = [];
  let cur = "";
  let depth = 0;
  for (const c of block) {
    if (c === "(") depth++;
    if (c === ")") depth--;
    if (c === ";" && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out
    .map((d) => {
      const k = d.indexOf(":");
      return [d.slice(0, k).trim(), d.slice(k + 1).trim()];
    })
    .filter(([p]) => p);
}

const modernColor = /(color-mix|oklab|oklch|(?<![\w-])lab|(?<![\w-])lch)\(/;
const isColorSupports = (c) => /^@supports\s*\(color:\s*(color-mix|oklab|oklch|lab|lch)/i.test(c);
const isGradientFallback = (c) => /^@supports\s+not\s*\(background-image:\s*linear-gradient\(in /i.test(c);
const isSvhFallback = (c) => /^@supports\s+not\s*\(height:\s*1[sdl]vh\)/i.test(c);
const isHasFallback = (c) => /^@supports\s+not\s+selector\(:has\(/i.test(c);
const isContainer = (c) => /^@container\b/i.test(c);
const viewportUnit = /(^|[^\w-])[\d.]+[sdl]vh\b/;
const gradientInterp = /(^|[\s(,])(?:to\s+[a-z ]+\s+)?in\s+(oklab|oklch|lab|lch|srgb|display-p3|hsl|hwb|xyz)\b/i;
/** The value with every color-mix(…) removed: its own `in <space>` isn't gradient interpolation. */
const withoutColorMix = (v) => {
  let out = v;
  for (let i = out.indexOf("color-mix("); i >= 0; i = out.indexOf("color-mix(")) {
    let depth = 0;
    let j = i + "color-mix".length;
    for (; j < out.length; j++) {
      if (out[j] === "(") depth++;
      if (out[j] === ")" && --depth === 0) break;
    }
    out = out.slice(0, i) + "transparent" + out.slice(j + 1);
  }
  return out;
};
const unprefixed = (p) => p.replace(/^-webkit-|^-moz-/, "");
const short = (s) => (s.length > 110 ? s.slice(0, 107) + "..." : s);

const errors = [];
const cssFiles = walk(chunksDir, ".css");
const rules = cssFiles.flatMap((f) => parse(readFileSync(f, "utf8")));

// Index plain (no modern colour) declarations by selector + property + context.
const plainKey = (sel, prop, ctx) => `${sel}|${unprefixed(prop)}|${ctx.filter((c) => !isColorSupports(c)).join("|")}`;
const plain = new Set();
for (const r of rules) for (const [p, v] of r.decls) if (!modernColor.test(v)) plain.add(plainKey(r.sel, p, r.ctx));

const gradientOverrides = new Set();
const svhOverrides = new Set();
const hasOverrides = new Set();
for (const r of rules) {
  if (r.ctx.some(isGradientFallback)) r.sel.split(",").forEach((s) => gradientOverrides.add(s.trim()));
  if (r.ctx.some(isSvhFallback)) r.sel.split(",").forEach((s) => svhOverrides.add(s.trim()));
  if (r.ctx.some(isHasFallback))
    r.sel.split(",").forEach((s) => hasOverrides.add(s.trim().replace(/:focus-within$/, "")));
}

for (const r of rules) {
  const where = `${short(r.sel)}${r.ctx.length ? `  [${short(r.ctx.join(" > "))}]` : ""}`;
  const fallbackBlock = r.ctx.some((c) => isGradientFallback(c) || isSvhFallback(c) || isHasFallback(c));
  // 7. container queries
  if (r.ctx.some(isContainer)) errors.push(`container query (not in the support target): ${where}`);
  for (const [i, [p, v]] of r.decls.entries()) {
    // 1. modern colour function without a plain fallback
    if (modernColor.test(v) && !plain.has(plainKey(r.sel, p, r.ctx)))
      errors.push(`modern colour function without fallback: ${where} { ${p}: ${short(v)} }`);
    // 2. gradient interpolation without the @supports not override
    if (/gradient\(/.test(v) && gradientInterp.test(withoutColorMix(v)) && !fallbackBlock) {
      const ok = r.sel.split(",").every((s) => gradientOverrides.has(s.trim()));
      if (!ok) errors.push(`gradient colour interpolation without fallback: ${where} { ${p}: ${short(v)} }`);
    }
    // 3. svh/dvh/lvh without a vh fallback
    if (viewportUnit.test(v) && !fallbackBlock) {
      const before = r.decls.slice(0, i).some(([p2, v2]) => p2 === p && /\dvh\b/.test(v2) && !viewportUnit.test(v2));
      const ok = before || r.sel.split(",").every((s) => svhOverrides.has(s.trim()));
      if (!ok) errors.push(`small/dynamic viewport unit without vh fallback: ${where} { ${p}: ${v} }`);
    }
    // 5. backdrop-filter without the -webkit- prefix
    if (p === "backdrop-filter" && !r.decls.some(([p2]) => p2 === "-webkit-backdrop-filter"))
      errors.push(`backdrop-filter without -webkit-backdrop-filter: ${where}`);
  }
  // 4. :has() without an @supports not selector(:has(*)) fallback
  if (/:has\(/.test(r.sel) && !fallbackBlock) {
    for (const s of r.sel.split(",")) {
      const base = s.trim().split(":has(")[0];
      if (!hasOverrides.has(base)) errors.push(`:has() without fallback: ${short(s.trim())}`);
    }
  }
  // 6. native nesting left in the output (an unescaped &)
  if (/(^|[^\\])&/.test(r.sel)) errors.push(`native CSS nesting in output: ${where}`);
}

// 8. Inline styles with modern colour functions (no fallback possible).
for (const file of walk(pagesDir, ".html")) {
  const html = readFileSync(file, "utf8").replace(/<style[\s\S]*?<\/style>/g, "");
  for (const m of html.matchAll(/style="([^"]*)"/g))
    if (modernColor.test(m[1])) errors.push(`inline style with a modern colour function: ${relative(pagesDir, file)}: ${short(m[1])}`);
}
for (const file of walk(chunksDir, ".js")) {
  const js = readFileSync(file, "utf8");
  for (const m of js.matchAll(/["'`]([^"'`\n]{0,200}?(?:color-mix|oklab|oklch)\([^"'`\n]{0,200})["'`]/g))
    errors.push(`modern colour function in client JS (inline style?): ${relative(chunksDir, file)}: ${short(m[1])}`);
}

if (cssFiles.length === 0) console.warn(`check-built-css: warning: no CSS in ${relative(next, chunksDir)}, check skipped`);
if (errors.length > 0) {
  console.error(
    `check-built-css: ${errors.length} problem(s) for the browser support target (.browserslistrc):\n  ${errors.join("\n  ")}\n` +
      "Add a fallback in the CSS, or use a CSS class instead of an inline style.",
  );
  process.exit(1);
}
console.log(`check-built-css: ${cssFiles.length} stylesheets, ${rules.length} rules; every modern feature has a fallback for the support target.`);
