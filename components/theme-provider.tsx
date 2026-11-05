"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

function getLocalStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setLocalStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "theme-v1" }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    setLocalStorageItem(storageKey, next);
  };

  React.useEffect(() => {
    setMounted(true);
    const stored = getLocalStorageItem(storageKey);
    if (stored === "light" || stored === "dark" || stored === "system") {
      setThemeState(stored);
    }
  }, []);

  const resolvedTheme = React.useMemo(() => {
    if (!mounted) return "light";
    if (theme === "system") {
      if (typeof window === "undefined") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }, [theme, mounted]);

  React.useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (next: Theme) => void;
  resolvedTheme: "light" | "dark";
  mounted: boolean;
}>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
  mounted: false,
});

export function useTheme() {
  return React.useContext(ThemeContext);
}
