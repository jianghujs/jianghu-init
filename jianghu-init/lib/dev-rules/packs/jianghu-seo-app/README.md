# OpenJianghu SEO App

Use this rule pack for OpenJianghu SEO/document-site apps like `106.cn-openjianghu-seo-v2`.

## Project Shape

- Framework: Egg + `@jianghujs/jianghu`
- Routes: `config.xfPageRouteMap` + `app/router.js`
- Main render entry: `app/controller/xfPage.js`
- Page data: `app/service/xfPage.js`
- Article data and SEO HTML: `app/service/article.js`
- Article custom tags: `app/service/articleParser.js`
- Category navigation: `app/service/category.js`
- Templates: `app/view/page/`, `app/view/xfpageTemplate/`, `app/view/template/`
- Search integration: `meilisearchScript/`, `README.meilisearch.md`, `app/public/meilisearch/`

## Boundaries

- This is not an init-json generated page project. Do not start by looking for `app/view/init-json/`.
- Prefer existing Egg/Jianghu service/controller/template patterns.
- Keep route behavior driven by `config.xfPageRouteMap` unless the task explicitly requires router changes.
- Preserve `appId`-prefixed URLs such as `/${appId}/...`.
- Treat SEO content fields such as `xfPageTitle`, `xfPageTagList`, `xfPageDescription`, and `articleContentForSeo` as first-class output concerns.

## Common Commands

```bash
npm run dev
npm run dev:cn
npm run lint
npm run test-local
```
