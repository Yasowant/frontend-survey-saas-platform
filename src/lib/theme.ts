import { KEYS, read, write } from "./storage";

export type Theme = "light" | "dark";

export function getTheme(): Theme {
  return read<Theme>(KEYS.theme, "light");
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme: Theme): void {
  write(KEYS.theme, theme);
  applyTheme(theme);
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}
