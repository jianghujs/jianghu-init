'use strict';

const fs = require('fs');
const path = require('path');
const {
  SEMANTIC_VIEW_KEY_MIGRATIONS,
  SEMANTIC_STRUCTURAL_MIGRATIONS,
  RUNTIME_PROP_MIGRATIONS,
  RUNTIME_PROP_MIGRATION_GROUPS,
  SHEET_RETAINED_DEPRECATED_PROPS,
} = require('../lib/json/v7/migration/keyMigrations');

const outputPaths = [
  path.resolve(__dirname, '../vscode-extension/src/generated/v7-key-migrations.json'),
  path.resolve(__dirname, '../vscode-extension/out/generated/v7-key-migrations.json'),
];
const artifact = {
  semantic: SEMANTIC_VIEW_KEY_MIGRATIONS,
  structural: SEMANTIC_STRUCTURAL_MIGRATIONS,
  runtime: RUNTIME_PROP_MIGRATIONS,
  runtimeGroups: RUNTIME_PROP_MIGRATION_GROUPS,
  sheetRetainedDeprecatedProps: SHEET_RETAINED_DEPRECATED_PROPS,
};

for (const outputPath of outputPaths) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(`Synced ${path.relative(process.cwd(), outputPath)}`);
}
