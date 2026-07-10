# jianghu-init Tooling Rules

This is the `jianghu-init` tool repository, not a generated JianghuJS app.

## Scope

- `jianghu-init dev-rules` is a product command for JianghuJS app projects.
- Do not use `dev-rules` output as the source of truth for this repository's own `AGENTS.md`.
- Keep this file concise and maintain it by hand when tooling rules change.

## Key Areas

- V7 init-json compiler: `lib/json/v7/`
- V7 examples and smoke tests: `lib/json/v7/pages/examples/`
- VSCode schema and hover support: `vscode-extension/src/schemas/v7/`, `vscode-extension/src/v7ConfigHoverProvider.ts`
- AI app-rule generator: `lib/dev-rules/`, `lib/init_dev_rules.js`

## V7 Action Rule

- V7 semantic action items must use `label` + `uiAction`.
- Do not introduce new `intent`, `id`, or `actionId` usage for semantic actions.
- Legacy keys may be read only for compatibility where existing compiler code explicitly supports them.

## Dev-Rules Product Boundary

- App users should get app-facing rules for `app/view/init-json/**/*.js`.
- Tooling/compiler development rules belong in this repository guidance or a dedicated Codex skill, not in the default `jianghu-init dev-rules` command flow.
- If changing adapters, keep all targets generated from the same source templates:
  - Codex: `AGENTS.md`
  - Cursor: `.cursor/rules/*.mdc`
  - Kiro: `.kiro/steering/*.md`
  - Claude Code: `CLAUDE.md` + `.claude/rules/*.md`

## Verification

Run focused checks after changing V7 compiler, schema, hover, or dev-rules:

```bash
node lib/json/v7/actionIntent.test.js
node lib/json/v7/pages/examples/smoke-platform-layout.js
node lib/json/v7/pages/examples/validate-examples.js
```

For VSCode extension changes:

```bash
cd vscode-extension
npm run compile
```
