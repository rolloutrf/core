# Rules for Claude

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
