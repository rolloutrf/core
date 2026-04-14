import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

interface CollectionItem {
  slug: string
  title?: string
  name?: string
  content: string
}

interface CollectionDetailPageProps {
  dataPath: string
  backPath: string
  backLabel: string
  titleFallbackKey?: 'title' | 'name'
}

export function CollectionDetailPage({
  dataPath,
  backPath,
  backLabel,
  titleFallbackKey = 'title',
}: CollectionDetailPageProps) {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [item, setItem] = useState<CollectionItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(dataPath)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data: CollectionItem[]) => {
        if (cancelled) return

        const nextItem = data.find((entry) => entry.slug === slug) ?? null
        setItem(nextItem)
        setLoading(false)
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [dataPath, slug])

  if (loading) {
    return (
      <div className="py-12 px-6">
        <div className="max-w-5xl mx-auto text-muted-foreground text-sm animate-pulse">Загрузка…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 px-6">
        <div className="max-w-5xl mx-auto text-muted-foreground text-sm">Ошибка загрузки: {error}</div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="py-16 px-6 max-w-7xl mx-auto text-muted-foreground">
        Страница не найдена.{' '}
        <button onClick={() => navigate(-1)} className="underline underline-offset-2">
          Назад
        </button>
      </div>
    )
  }

  const pageTitle = titleFallbackKey === 'name' ? (item.name ?? item.title ?? '') : (item.title ?? item.name ?? '')

  return (
    <div className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(backPath)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-10 flex items-center gap-1"
        >
          ← {backLabel}
        </button>

        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-normal tracking-tight mb-8 mt-0">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-normal mt-10 mb-4">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-normal mt-6 mb-2">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 mb-4 text-muted-foreground">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-normal text-foreground">{children}</strong>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-foreground hover:text-muted-foreground transition-colors"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="border-border my-8" />,
            code: ({ children }) => (
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-border pl-4 text-muted-foreground italic my-4">
                {children}
              </blockquote>
            ),
          }}
        >
          {item.content.startsWith('# ') ? item.content : `# ${pageTitle}\n\n${item.content}`}
        </ReactMarkdown>
      </div>
    </div>
  )
}
