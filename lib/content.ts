export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function parseConfig<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return { ...fallback, ...((JSON.parse(value) as Partial<T> | null) ?? {}) };
  } catch {
    return fallback;
  }
}

export function ik(url: string, width: number): string {
  if (!url || !url.includes("ik.imagekit.io")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}tr=w-${width},q-80`;
}
