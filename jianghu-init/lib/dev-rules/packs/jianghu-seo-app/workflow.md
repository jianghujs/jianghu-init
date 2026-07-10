# SEO App Workflow

## Before Editing

1. Identify whether the task is route, template, article data, category navigation, custom tag parsing, or search.
2. Read the narrow files first:
   - Route: `config/config.default.js`, `app/router.js`
   - Render entry: `app/controller/xfPage.js`
   - Page data: `app/service/xfPage.js`
   - Article content: `app/service/article.js`, `app/service/articleParser.js`
   - Template: `app/view/page/xfArticle.html`, `app/view/xfpageTemplate/*.html`
   - Search: `README.meilisearch.md`, `meilisearchScript/`
3. Avoid broad rewrites of templates or services when a small data/template change is enough.

## Change Rules

- Keep Nunjucks/Egg rendering style consistent with existing templates.
- Preserve `ctx.app.config.appId` and `__appId__` replacement behavior.
- Be careful with public/login article visibility and permission fallback text.
- For generated article HTML, avoid unsafe broad regex replacements unless the existing service already uses that convention.
- When adding SEO page fields, wire the data source, template block, and default config together.

## Verification

- For service/template changes, run `npm run lint` when feasible.
- For behavior changes, run `npm run dev` or `npm run dev:cn` and inspect the affected URL.
- For Meilisearch changes, use the scripts documented in `README.meilisearch.md`.
