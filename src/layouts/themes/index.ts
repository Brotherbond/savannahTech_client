import { useMemo } from "react";
import {
  createTheme,
  SimplePaletteColorOptions,
  useMediaQuery,
} from "@mui/material";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xsm: true;
    xsmm: true;
    smm: true;
    mdm: true;
    lgm: true;
    xlm: true;
  }

  interface ThemeOptions {
    breakpoints?: {
      values?: {
        xs?: number;
        xsm?: number;
        xsmm?: number;
        sm?: number;
        smm?: number;
        md?: number;
        mdm?: number;
        lg?: number;
        lgm?: number;
        xl?: number;
        xlm?: number;
      };
    };
  }

  interface Palette {
    tertiary: SimplePaletteColorOptions;
  }
  interface PaletteOptions {
    tertiary: SimplePaletteColorOptions;
  }
}
const useTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: light)");
  return useMemo(
    () =>
      createTheme({
        breakpoints: {
          values: {
            xs: 0,
            xsm: 320,
            xsmm: 425,
            sm: 600,
            smm: 768,
            md: 900,
            mdm: 1024,
            lg: 1200,
            lgm: 1350,
            xl: 1536,
            xlm: 1980,
          },
        },
        palette: {
          primary: {
            main: "#222",
            light: "#525252",
            dark: "#111111",
          },
          secondary: {
            main: "#7e35fe",
            light: "#8036ff",
          },
          background: {
            default: "#fafafa",
            paper: "#fafafa80",
          },
          tertiary: {
            main: "#d1d5db",
            light: "#e6e6e6",
          },
          success: {
            main: "#03cc3b",
          },
        },
        typography: {
          fontFamily:
            "Roboto, system-ui, -apple-system, Segoe UI, Helvetica Neue, Noto Sans, Liberation Sans, Arial, sans-serif, Apple Color Emoji, NotoColorEmojiLimited, Segoe UI Emoji, Segoe UI Symbol",
        },
      }),
    []
  );
};

export default useTheme;
