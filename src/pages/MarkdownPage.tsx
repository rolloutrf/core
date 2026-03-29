import { useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useFetch } from '@/hooks/useFetch'

interface LocationState {
  rawUrl: string
  title: string
  backPath: string
  backLabel: string
}

export function MarkdownPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  const { data: content, loading, error } = useFetch<string>(state?.rawUrl ?? '')

  if (!state?.rawUrl) {
    return (
      <div className="py-16 px-6 max-w-7xl mx-auto text-muted-foreground">
        Страница не найдена.{' '}
        <button onClick={() => navigate(-1)} className="underline underline-offset-2">
          Назад
        </button>
      </div>
    )
  }

  return (
    <div className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(state.backPath)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-10 flex items-center gap-1"
        >
          ← {state.backLabel}
        </button>

        {loading && (
          <div className="text-muted-foreground text-sm animate-pulse">Загрузка…</div>
        )}

        {error && (
          <div className="text-muted-foreground text-sm">Ошибка загрузки: {error}</div>
        )}

        {!loading && !error && content && (
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-normal tracking-tight mb-8 mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-10 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold mt-6 mb-2">{children}</h3>
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
                <strong className="font-semibold text-foreground">{children}</strong>
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
            {content as string}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}
