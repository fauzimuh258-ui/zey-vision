// Converts this package's token JSON files (Parts 1/2/4) into a single
// JSON file shaped for Figma's Plugin API (figma.variables.*) — hex
// strings become {r,g,b,a} 0-1 floats (COLOR variables require this;
// Figma doesn't accept hex), ms strings become plain numbers.
//
// This is a design-time tool, not part of the shipped package: it reads
// local files and writes local output. It doesn't call Figma's REST API
// (that would need an Enterprise org for the Variables endpoints) — the
// output is meant to be read by the companion plugin in figma-plugin/,
// which creates the variables from inside Figma itself instead, which
// works on any plan.
//
// Usage: node scripts/tokens-to-figma.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function hexToRgba(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return { r, g, b, a: 1 };
}

const colorTokens = JSON.parse(readFileSync(join(root, "src", "design-tokens.json"), "utf8"));

const figmaDocument = {
  collections: [
    {
      name: "Zey Vision / Neutral",
      modes: ["Value"],
      variables: Object.entries(colorTokens.neutral).map(([step, hex]) => ({
        name: `neutral/${step}`,
        type: "COLOR",
        valuesByMode: { Value: hexToRgba(hex) },
      })),
    },
    {
      name: "Zey Vision / Circadian",
      // One Figma mode per keyframe phase — lets a designer flip a frame
      // between "night" and "midday" the same way the running app
      // interpolates between them at runtime, minus the interpolation
      // (Figma modes are discrete, not continuous).
      modes: colorTokens.circadian.keyframes
        .filter((kf, i, arr) => arr.findIndex((k) => k.phase === kf.phase) === i)
        .map((kf) => kf.phase),
      variables: (() => {
        const colorKeys = Object.keys(colorTokens.circadian.keyframes[0].colors);
        return colorKeys.map((key) => ({
          name: `circadian/${key}`,
          type: "COLOR",
          valuesByMode: Object.fromEntries(
            colorTokens.circadian.keyframes
              .filter((kf, i, arr) => arr.findIndex((k) => k.phase === kf.phase) === i)
              .map((kf) => [kf.phase, hexToRgba(kf.colors[key])])
          ),
        }));
      })(),
    },
    {
      name: "Zey Vision / Motion Duration (ms)",
      modes: ["Value"],
      variables: [
        { name: "duration/instant", type: "FLOAT", valuesByMode: { Value: 100 } },
        { name: "duration/fast", type: "FLOAT", valuesByMode: { Value: 150 } },
        { name: "duration/normal", type: "FLOAT", valuesByMode: { Value: 200 } },
        { name: "duration/slow", type: "FLOAT", valuesByMode: { Value: 320 } },
      ],
    },
  ],
};

writeFileSync(
  join(root, "figma-plugin", "tokens.generated.json"),
  JSON.stringify(figmaDocument, null, 2)
);

console.log(`Wrote figma-plugin/tokens.generated.json with ${figmaDocument.collections.length} collections.`);
