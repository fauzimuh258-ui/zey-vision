import type { StorybookConfig } from "@storybook/react-vite";

// Storybook 10 is ESM-only; addon-essentials and addon-interactions have
// been dismantled into core / superseded (verified before writing this —
// docs/controls/actions/viewport now ship in core). addon-vitest is what
// turns every story's play() function into a real, CI-runnable test (see
// vitest.config.ts) — that's also why a separate Modal interaction test
// file isn't duplicated elsewhere in this package.
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
