---
name: jianghu-seo-development
description: Develop, extend, troubleshoot, or review OpenJianghu SEO and documentation-site applications such as cn-openjianghu-seo-v2. Use for xfPage routes, Egg controller/service rendering, Nunjucks page templates, article SEO HTML and custom tags, category navigation, appId-prefixed URLs, metadata, and Meilisearch indexing or search. Do not use for JianghuJS init-json generated pages.
---

# OpenJianghu SEO Development

Treat this as an Egg/Jianghu service-to-Nunjucks rendering application, not an init-json project.

## Workflow

1. Read `.ai-rules/jianghu-seo-app/README.md` and inspect nearby project code before choosing an extension point.
2. Classify the task and load only the matching reference:
   - Route, page data, metadata, template, or category navigation: [references/render-pipeline.md](references/render-pipeline.md)
   - Article HTML, visibility, or custom tags: [references/article-and-tags.md](references/article-and-tags.md)
   - Meilisearch indexing or frontend search: [references/search-and-index.md](references/search-and-index.md)
   - Review, audit, or regression investigation: [references/review-checklist.md](references/review-checklist.md), plus the affected domain reference
3. Trace the complete affected path from configuration or route through controller/service data to final HTML or search output.
4. Extend the nearest existing pattern. Keep changes narrow and avoid introducing a parallel rendering or routing mechanism.
5. Preserve appId-prefixed URLs, route-map ownership, article visibility, parser behavior, and metadata defaults.
6. Run the narrowest project command and inspect the affected URL or search result when a safe runtime is available.
7. Report runtime, index, permission, or production-data validation that could not run.

## Boundaries

- Do not look for `app/view/init-json` unless the repository actually contains an independent init-json application area.
- Do not teach or rewrite generic Nunjucks/Egg patterns when project-local code already establishes the convention.
- Do not invent service fields, route keys, parser tags, index names, or permission behavior.
- Explain before rebuilding a shared search index or running a script that writes remote data.

