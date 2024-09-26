import { useState, useEffect } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleSetTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme as "light" | "dark");
        if (storedTheme === "dark") {
          document.documentElement.classList.add("dark");
        }
      } else {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (systemPrefersDark) {
          handleSetTheme("dark");
        }
      }
    }
  }, []);

  return { theme, setTheme: handleSetTheme };
}
