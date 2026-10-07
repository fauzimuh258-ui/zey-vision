import type { Preview } from "@storybook/react";
import "../src/styles/theme.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
    backgrounds: {
      default: "zey-vision-midday",
      values: [
        { name: "zey-vision-midday", value: "#F0EAE0" },
        { name: "zey-vision-night", value: "#1A1A1A" },
      ],
    },
  },
};

export default preview;
