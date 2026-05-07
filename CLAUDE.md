# Rules for Claude

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
