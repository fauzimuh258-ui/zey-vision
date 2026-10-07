import { defineConfig } from "tsdown";

/**
 * tsdown, not tsup: tsup's own README now points to tsdown as its
 * maintained successor (same authors' lineage, built on Rolldown).
 *
 * unbundle: true (rather than the default bundled build) is doing two
 * jobs here, not one:
 *   1. It's what makes "@zey/vision/components/Button"-style subpath
 *      imports actually resolve to a real, individual output file — the
 *      literal meaning of "tree-shakeable per-component import."
 *   2. It sidesteps a real, currently-open tsdown issue where bundling
 *      multiple "use client" source files into one shared chunk drops
 *      the directive from all but one of them. Unbundle mode keeps a
 *      1:1 file mapping, so every "use client" file keeps its own
 *      directive on its own output file.
 */
export default defineConfig({
  entry: ["src/index.ts", "src/next/index.ts", "tailwind-preset.ts"],
  unbundle: true,
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  outDir: "dist",
  platform: "browser",
});
