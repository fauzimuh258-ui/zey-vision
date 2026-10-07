import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    items: [
      { id: "overview", label: "Overview", content: <p>Overview content.</p> },
      { id: "settings", label: "Settings", content: <p>Settings content.</p> },
      { id: "billing", label: "Billing", content: <p>Billing content.</p> },
    ],
  },
};
