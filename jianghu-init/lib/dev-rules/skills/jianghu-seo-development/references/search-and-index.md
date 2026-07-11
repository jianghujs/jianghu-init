# Meilisearch and Search Integration

Use for index scripts, searchable fields, ranking/filter settings, search APIs, and frontend search assets.

## Inspect first

- Read `README.meilisearch.md` and the exact scripts under `meilisearchScript/`.
- Locate index name, host, key source, document ID, searchable/filterable/sortable fields, and update mode.
- Trace frontend query code and result URL construction.
- Confirm whether the environment uses a shared remote index or a safe local/test index.

## Change rules

- Keep script configuration aligned with application config and documentation.
- Update producer fields, index settings, query fields, and result rendering together.
- Preserve stable document IDs and appId-prefixed result links.
- Avoid replacing assets under `app/public/meilisearch/` unless the task is an intentional dependency update.
- Do not expose admin keys or write credentials to browser code, logs, generated rules, or committed configuration.
- Do not rebuild, clear, or replace a shared index without explicit authorization and a recovery plan.

## Verification

- Prefer a local/test index or a read-only query for initial validation.
- Verify representative Chinese and English terms when the site supports both.
- Check empty queries, no-result states, malformed input, filters, pagination, highlighting, and result links.
- Confirm newly indexed fields appear and removed fields are not still assumed by the frontend.
- Compare document count and a sample of indexed documents before and after a write operation.
- Report any remote-index mutation not performed.

