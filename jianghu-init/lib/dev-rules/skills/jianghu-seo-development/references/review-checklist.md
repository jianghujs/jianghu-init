# SEO Review Checklist

Lead with concrete findings and file/line evidence. Do not edit unless the user requests a fix.

## Architecture and scope

- Classify the change as route, controller, service data, template, article parser, category, or search.
- Verify the change uses the established extension point and does not create a parallel pipeline.
- Check all affected layers, not only the edited template or service.

## Routes and URLs

- Route keys match `config.xfPageRouteMap` and router behavior.
- Internal links retain the appId prefix and correct parameters.
- Existing page IDs, article IDs, category IDs, redirects, and share links remain compatible.

## Rendering and metadata

- Controller/service data matches template fields and defaults.
- Title, description, keyword/tag, canonical, and share metadata are deliberate and page-specific.
- Nunjucks extends/includes/blocks resolve and use correct escaping.
- Empty, missing, or partial data does not produce broken HTML.

## Articles and permissions

- Public/login/restricted content behavior remains distinct.
- `articleContentForSeo` remains valid HTML.
- Custom tags preserve syntax, malformed-input behavior, dependencies, and browser interaction.
- Parser changes avoid unsafe broad replacements and accidental raw HTML exposure.

## Search

- Index producer, settings, query fields, result rendering, and links agree.
- Credentials remain server-side and out of generated/client content.
- Shared index writes are explicit, authorized, and recoverable.
- Search assets are not casually replaced.

## Evidence and output

- Separate static findings from runtime, permission, and remote-index claims.
- Run non-mutating lint/tests or read-only queries when available.
- State URLs, article states, site variants, and search cases not tested.
- If no defect is found, say so and list residual validation gaps.

