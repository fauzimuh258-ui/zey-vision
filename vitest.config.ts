import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";

/**
 * Two Vitest projects, per Storybook's own current guidance for adding
 * addon-vitest to a package that already has plain unit tests:
 *
 * - "unit": pure-logic tests (e.g. color-system.test.ts) in jsdom — fast,
 *   no browser needed.
 * - "storybook": every *.stories.tsx file, including play() functions
 *   (see Modal.stories.tsx), run for real in Chromium via Playwright.
 *   This is what actually exercises the focus-trap / Escape-to-close /
 *   focus-restoration behavior end-to-end, rather than approximating it
 *   in jsdom.
 */
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react()],
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
          include: ["src/**/*.test.{ts,tsx}"],
        },
      },
      {
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: ["./.storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
