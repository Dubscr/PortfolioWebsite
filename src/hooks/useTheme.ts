import { useEffect, useState } from "react";
import type { ThemeName } from "../types/portfolio";

export function useTheme(initial: ThemeName) {
  const [themeName, setThemeName] = useState<ThemeName>(initial);

  useEffect(() => {
    document.documentElement.style.colorScheme = themeName === "minimal" ? "light" : "dark";
  }, [themeName]);

  return { themeName, setThemeName };
}
