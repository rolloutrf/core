import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  return match ? match[1] : null
}

function stripIframe(content: string) {
  return content.replace(/<iframe[\s\S]*?<\/iframe>/gi, '').trim()
}

export function VideoPage() {
  const [videos, setVideos] = useState<CallFile[]>([])
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
        if (!cancelled) {
          setVideos(normalizeCallsResponse(data).filter((item) => Boolean(extractIframeSrc(item.content))))
          setLoading(false)
        }
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
  }, [])

  return (
    <div className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Видео</h1>
        <p className="text-muted-foreground mb-10 md:mb-12 max-w-lg leading-relaxed">
          Записи созвонов и материалы проекта
        </p>

        {loading && <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>}
        {error && <p className="text-muted-foreground text-sm">Ошибка загрузки: {error}</p>}

        {!loading && !error && (
          <div className="space-y-12">
            {videos.map((video) => {
              const iframeSrc = extractIframeSrc(video.content)
              const markdownContent = stripIframe(video.content)

              return (
                <section key={video.slug} className="border-t border-border pt-8">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-normal tracking-tight">{video.title}</h2>
                    <Link
                      to={`/созвоны/${video.slug}`}
                      className="text-sm text-[#E8552D] hover:text-foreground transition-colors shrink-0"
                    >
                      Открыть страницу →
                    </Link>
                  </div>

                  {iframeSrc && (
                    <div className="aspect-video border border-border bg-black mb-6">
                      <iframe
                        src={iframeSrc}
                        title={video.title}
                        className="h-full w-full"
                        allow="fullscreen; picture-in-picture; encrypted-media"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {markdownContent && (
                    <ReactMarkdown
                      components={{
                        h1: () => null,
                        h2: ({ children }) => (
                          <h3 className="text-xl font-normal mt-8 mb-4 text-[#E8552D]">{children}</h3>
                        ),
                        h3: ({ children }) => (
                          <h4 className="text-base font-normal mt-6 mb-2">{children}</h4>
                        ),
                        p: ({ children }) => (
                          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside space-y-1 mb-4 text-muted-foreground">{children}</ol>
                        ),
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="font-normal text-foreground">{children}</strong>,
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 text-[#E8552D] hover:text-foreground transition-colors"
                          >
                            {children}
                          </a>
                        ),
                        hr: () => <hr className="border-border my-8" />,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l border-border pl-4 text-muted-foreground italic my-4">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {markdownContent}
                    </ReactMarkdown>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
