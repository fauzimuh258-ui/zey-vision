// Run inside Figma (via Plugins > Development > Import plugin from
// manifest). Reads tokens.generated.json (produced by
// scripts/tokens-to-figma.mjs, bundled in at build time via a JSON
// import) and creates matching Variable Collections in the current file.
//
// Uses the documented figma.variables.* Plugin API: collections default
// to one mode, addMode() adds more, setValueForMode() takes {r,g,b,a}
// floats for COLOR variables (never hex) and plain numbers for FLOAT.
// This only needs the Plugin API (works on any Figma plan) — Figma's
// REST API for bulk variable writes needs an Enterprise org, which this
// avoids entirely. Needs @figma/plugin-typings as a devDependency to
// type-check in a real project (the `figma` global and `VariableValue`
// type come from there — not something verifiable outside Figma itself).

import tokens from "./tokens.generated.json";

interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface TokenVariable {
  name: string;
  type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  valuesByMode: Record<string, RgbaColor | number | string | boolean>;
}

interface TokenCollection {
  name: string;
  modes: string[];
  variables: TokenVariable[];
}

interface TokensDocument {
  collections: TokenCollection[];
}

function createCollection(source: TokenCollection): void {
  const collection = figma.variables.createVariableCollection(source.name);

  const modeIds: Record<string, string> = {
    [source.modes[0]]: collection.modes[0].modeId,
  };
  collection.renameMode(collection.modes[0].modeId, source.modes[0]);

  for (const modeName of source.modes.slice(1)) {
    modeIds[modeName] = collection.addMode(modeName);
  }

  for (const variableSource of source.variables) {
    const variable = figma.variables.createVariable(
      variableSource.name,
      collection,
      variableSource.type
    );

    for (const [modeName, value] of Object.entries(variableSource.valuesByMode)) {
      const modeId = modeIds[modeName];
      if (modeId) {
        variable.setValueForMode(modeId, value as VariableValue);
      }
    }
  }
}

function main(): void {
  const document = tokens as unknown as TokensDocument;
  for (const collection of document.collections) {
    createCollection(collection);
  }
  figma.notify(`Created ${document.collections.length} variable collections.`);
  figma.closePlugin();
}

main();
