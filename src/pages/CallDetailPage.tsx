import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

interface CallFile {
  slug: string
  title: string
  content: string
}

interface CallsResponse {
  items?: CallFile[]
}

function normalizeCallsResponse(data: CallFile[] | CallsResponse) {
  return Array.isArray(data) ? data : (data.items ?? [])
}

function extractIframeSrc(content: string) {
  const match = content.match(/<iframe[^>]*src="([^"]+)"[^>]*>/i)
  if (!match) return null

  const src = match[1]
  const cloudMatch = src.match(/video\.yandex\.cloud\/iframe\/([^?]+)/)
  if (cloudMatch) {
    return `https://runtime.video.cloud.yandex.net/player/video/${cloudMatch[1]}?autoplay=0&mute=0`
  }

  return src
}

function stripIframe(content: string) {
  return content
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/^#\s+.+(\n|$)/, '')
    .trim()
}

export function CallDetailPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [call, setCall] = useState<CallFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/data/calls.json')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data: CallFile[] | CallsResponse) => {
        if (cancelled) return

        const nextCall = normalizeCallsResponse(data).find((item) => item.slug === slug) ?? null
        setCall(nextCall)
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
  }, [slug])

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

  if (!call) {
    return (
      <div className="py-16 px-6 max-w-7xl mx-auto text-muted-foreground">
        Страница не найдена.{' '}
        <button onClick={() => navigate(-1)} className="underline underline-offset-2">
          Назад
        </button>
      </div>
    )
  }

  const iframeSrc = extractIframeSrc(call.content)
  const markdownContent = stripIframe(call.content)

  return (
    <div className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/calls')}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-10 flex items-center gap-1"
        >
          ← Звонки
        </button>

        <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-8">{call.title}</h1>

        {iframeSrc && (
          <div className="mb-8">
            <div className="aspect-video border border-border bg-muted">
              <iframe
                src={iframeSrc}
                title={call.title}
                className="h-full w-full"
                allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            </div>
            <a
              href={iframeSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Открыть видео в новой вкладке →
            </a>
          </div>
        )}

        {markdownContent && (
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
            {markdownContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}
