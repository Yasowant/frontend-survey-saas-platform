const isBrowser = typeof window !== "undefined";

export const KEYS = {
  theme: "ssm:theme",
} as const;

export function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T): void {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key: string): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
