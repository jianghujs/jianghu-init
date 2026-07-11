# SEO Render Pipeline

Use for route, page-data, metadata, category, and Nunjucks-template work.

## Trace before editing

Follow the project-local chain:

```text
config.xfPageRouteMap / app/router.js
  -> app/controller/xfPage.js
  -> app/service/xfPage.js or domain service
  -> app/view/page or app/view/xfpageTemplate
  -> final HTML and metadata
```

Confirm the exact chain in the repository; variants may route or compose services differently.

## Extension rules

- Add or change a route through `config.xfPageRouteMap` unless current code proves a direct router entry is required.
- Keep controller code focused on request handling and render orchestration.
- Assemble page data and defaults in the established service layer.
- Extend the nearest layout, block, include, or template family rather than duplicating a full page.
- When adding a template field, update its data source, default behavior, and every required template block together.
- Keep category navigation and page links consistent with existing service output.

## URL contract

- Preserve `ctx.app.config.appId`, `__appId__`, and project-established replacement behavior.
- Keep internal links under the configured appId prefix.
- Preserve route parameters and query behavior used by callers, menus, shares, and article links.
- Do not normalize or rename route keys as an unrelated cleanup.

## SEO output

Check the final rendered values for:

- Specific page or article title.
- Description and keyword/tag blocks where exposed.
- Canonical, share, or social metadata when the template supports it.
- Sensible defaults when optional page data is absent.
- Correct escaping: text should escape; intentional trusted HTML should follow the existing rendering path.

## Verification

- Run project lint/tests when feasible.
- Start the documented development command only when authorized.
- Visit the exact affected appId-prefixed URL.
- Inspect final HTML, title, metadata, internal links, empty-data behavior, and server errors.
- Verify both configured site variants when `dev` and `dev:cn` represent different data or routes.

