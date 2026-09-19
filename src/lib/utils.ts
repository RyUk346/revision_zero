/** Convert any string into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Format a date for display, e.g. "14 June 2026". */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Short date, e.g. "14 Jun 2026". */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Get the value of a FormData field as a trimmed string (or undefined). */
export function field(form: FormData, name: string): string | undefined {
  const v = form.get(name);
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

/** Get a boolean from a checkbox FormData field. */
export function boolField(form: FormData, name: string): boolean {
  const v = form.get(name);
  return v === "on" || v === "true" || v === "1";
}

/** Get an integer from a FormData field with a fallback. */
export function intField(form: FormData, name: string, fallback = 0): number {
  const v = form.get(name);
  const n = typeof v === "string" ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

/** Truncate text to a maximum length, adding an ellipsis. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

/** Deterministic second colour for a gradient given a hex seed. */
export function gradientPair(hex: string): [string, string] {
  const base = hex?.startsWith("#") ? hex : "#34465e";
  // Darken the base a little for the gradient end.
  const num = parseInt(base.slice(1), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - 28);
  const g = Math.max(0, ((num >> 8) & 0xff) - 28);
  const b = Math.max(0, (num & 0xff) - 28);
  const end = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  return [base, end];
}
