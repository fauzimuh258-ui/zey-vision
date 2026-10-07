import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./primitives";

/**
 * A deliberately small example of plain Testing Library usage (jsdom, no
 * browser). Reserved for quick, non-visual assertions on simple
 * components. Anything involving real interaction, focus, or keyboard
 * behavior lives in a Storybook play() function instead (see
 * Modal.stories.tsx) — that runs in an actual browser via addon-vitest,
 * which is a more accurate test of that behavior than jsdom can be, so it
 * isn't duplicated here.
 */
describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies the tone's classes", () => {
    render(<Badge tone="error">Failed</Badge>);
    const badge = screen.getByText("Failed");
    expect(badge.className).toContain("bg-error-bg");
  });
});
