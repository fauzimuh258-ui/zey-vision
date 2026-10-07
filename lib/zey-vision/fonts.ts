/**
 * Zey Vision — Font Loading (Part 2)
 * Uses next/font/google: fonts are self-hosted at build time, so there's no
 * runtime request to Google — consistent with the offline/no-tracking
 * constraint from Part 1.
 *
 * Spread `zeyVisionFontVariables` onto <html className={...}> in
 * app/layout.tsx.
 */

import { Literata, Work_Sans, JetBrains_Mono } from "next/font/google";

export const fontSerif = Literata({
  subsets: ["latin"],
  variable: "--zv-font-serif-raw",
  display: "swap",
});

export const fontSans = Work_Sans({
  subsets: ["latin"],
  variable: "--zv-font-sans-raw",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--zv-font-mono-raw",
  display: "swap",
});

export const zeyVisionFontVariables = [
  fontSerif.variable,
  fontSans.variable,
  fontMono.variable,
].join(" ");
