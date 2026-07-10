# SEO Checklist

Use this checklist when changing page templates, article rendering, route behavior, or search indexing.

## HTML Metadata

- Page title comes from the page/article data and remains specific.
- Keyword and description blocks are populated where templates expose them.
- Canonical or share metadata changes should be deliberate and consistent across templates.

## URL And Routing

- URLs stay under the configured `appId` prefix.
- Route keys match `config.xfPageRouteMap`.
- Internal article links use `/${appId}/page/article/{articleId}` style unless existing code requires a different path.

## Content Rendering

- `articleContentForSeo` remains valid HTML after parser transformations.
- `[jh-code-view .../]`, `[jh-toggle]`, and `[jh-article-query]` behavior stays compatible with `articleParser`.
- External links opened from rendered article content should preserve the existing target behavior.

## Search

- Meilisearch keys, host, and index scripts stay aligned with `README.meilisearch.md`.
- Search assets under `app/public/meilisearch/` are not replaced casually.
