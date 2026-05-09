# Rules for Claude

## Content — Line breaks in markdown

Markdown ignores single newlines and merges lines into one paragraph. To prevent this:

- Any line starting with `—` must be preceded by a blank line so each item renders as a separate paragraph.
- This is handled in `scripts/prebuild.mjs` inside the `typograph()` function via:
  ```js
  .replace(/([^\n])\n(— )/g, '$1\n\n$2')
  ```
- If new content patterns appear where single newlines should produce visible line breaks, apply the same fix: add a blank line before the affected lines in `typograph()`. Never rely on `  ` (trailing spaces) for line breaks.

## UI — Numbers and headings

Never place a number (index, counter, ordinal) on a separate line above a heading or title. Numbers must always be inline — on the same line as the text they label.

## UI — Heading consistency

All pages must use the same heading size for their top-level title:

```tsx
<h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">...</h1>
```

When rendering markdown via `ReactMarkdown`, always map `h1` to this same size — never downgrade it to `text-3xl` or render it as `<h2>`. Example:

```tsx
h1: ({ children }) => (
  <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-8 mt-0">{children}</h1>
),
```
