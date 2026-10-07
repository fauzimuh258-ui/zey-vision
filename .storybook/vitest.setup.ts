import { beforeAll } from "vitest";
import { setProjectAnnotations } from "@storybook/react";
import * as previewAnnotations from "./preview";

// Applies preview.tsx's parameters/decorators (theme CSS, a11y config) to
// every story when addon-vitest runs it as a test, so story-as-test
// behaves the same as story-in-the-Storybook-UI.
const project = setProjectAnnotations([previewAnnotations]);

beforeAll(project.beforeAll);
