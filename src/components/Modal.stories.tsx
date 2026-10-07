import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Modal } from "./Modal";
import { Button } from "./primitives";

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete this item?">
        <p className="mb-4 text-sm text-foreground-muted">This can&apos;t be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}

const meta: Meta<typeof ModalDemo> = {
  title: "Components/Modal",
  component: ModalDemo,
};
export default meta;

type Story = StoryObj<typeof ModalDemo>;

export const Default: Story = {};

// Real interaction test (runs in an actual browser via addon-vitest, not
// jsdom): open the modal, confirm focus moved inside it (the focus trap
// from ui-utils.ts), close with Escape, confirm focus returned to the
// trigger.
export const KeyboardFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open modal" });
    await userEvent.click(trigger);

    const dialog = await canvas.findByRole("dialog");
    await expect(dialog).toBeInTheDocument();
    await expect(document.activeElement).not.toBe(trigger);

    await userEvent.keyboard("{Escape}");
    await expect(document.activeElement).toBe(trigger);
  },
};
