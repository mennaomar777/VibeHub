"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import baseTheme from "@/theme";

type ColorMode = "light" | "dark";

const ColorModeContext = createContext<{
  mode: ColorMode;
  toggleColorMode: () => void;
}>({ mode: "light", toggleColorMode: () => undefined });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ColorModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<ColorMode>("light");

  useEffect(() => {
    const storedMode = localStorage.getItem("vibehub-color-mode");
    if (storedMode === "dark" || storedMode === "light") setMode(storedMode);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem("vibehub-color-mode", mode);
  }, [mode]);

  const toggleColorMode = useCallback(() => {
    setMode((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const theme = useMemo(
    () =>
      createTheme(baseTheme, {
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: { default: "#111722", paper: "#1b2432" },
                text: { primary: "#e8eef7", secondary: "#a6b4c8" },
                divider: "#354256",
              }
            : {}),
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
