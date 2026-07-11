# Article HTML and Custom Tags

Use for article rendering, access visibility, `articleContentForSeo`, and parser extensions.

## Data flow

Trace the actual repository path, usually involving:

```text
article route
  -> article service
  -> visibility/access decision
  -> articleParser transformations
  -> articleContentForSeo
  -> article Nunjucks template
```

Do not modify only the final template when the source HTML or parser owns the behavior.

## Article rules

- Preserve the distinction between public, login-required, unavailable, and permission-denied content.
- Keep fallback text and status behavior consistent with existing routes and callers.
- Preserve article identity, category links, appId-prefixed links, and share metadata.
- Keep `articleContentForSeo` valid HTML after every transformation.
- Avoid broad regex replacement across arbitrary HTML unless existing parser design safely constrains it.
- Preserve external-link target and rel behavior established by the project.

## Custom tags

Before adding or changing a tag such as `jh-code-view`, `jh-toggle`, or `jh-article-query`:

1. Find its parser implementation and existing content examples.
2. Record accepted attributes, body syntax, nesting, and failure behavior.
3. Preserve unknown or malformed input safely.
4. Verify generated HTML structure and escaping.
5. Verify any client-side script or style dependency still loads.
6. Check both SEO server output and browser interaction where the tag is interactive.

Do not introduce a second parser path for one tag when `articleParser` is the established extension point.

## Verification

- Test a normal public article.
- Test login-required or restricted content when affected.
- Test every changed tag with valid, missing, and malformed attributes.
- Inspect final HTML for broken nesting, accidental escaping, unsafe raw output, and incorrect links.
- Record browser or permission cases that cannot be exercised safely.

