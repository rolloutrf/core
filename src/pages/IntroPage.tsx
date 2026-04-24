import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const INTRO_RAW_URL = 'https://raw.githubusercontent.com/rolloutrf/data/main/Intro/%D0%98%D0%BD%D1%82%D1%80%D0%BE.md'

function normalizeMarkdown(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, '\n').trim()
  const lines = normalized.split('\n')
  const cleaned: string[] = []
  let skippedIntroTitle = false

  for (const line of lines) {
    if (line.trim() === '# Интро' && !skippedIntroTitle) {
      skippedIntroTitle = true
      continue
    }

    if (line.trim() === '# Интро' && cleaned.at(-1)?.trim() === '# Интро') {
      continue
    }

    cleaned.push(line)
  }

  return cleaned.join('\n').trim()
}

async function loadIntroContent(signal: AbortSignal) {
  try {
    const response = await fetch(INTRO_RAW_URL, { signal })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.text()
  } catch {
    const fallbackResponse = await fetch('/data/intro.json', { signal })

    if (!fallbackResponse.ok) {
      throw new Error(`HTTP ${fallbackResponse.status}`)
    }

    const fallbackData = await fallbackResponse.json() as { content?: string }

    if (!fallbackData.content) {
      throw new Error('Пустой ответ')
    }

    return fallbackData.content
  }
}

export function IntroPage() {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    loadIntroContent(controller.signal)
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [])

  const normalizedContent = useMemo(() => (content ? normalizeMarkdown(content) : ''), [content])

  if (loading) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>
        </div>
      </div>
    )
  }

  if (error || !normalizedContent) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-muted-foreground mb-6">Ошибка загрузки: {error ?? 'Неизвестная ошибка'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h2 className="text-3xl font-normal tracking-tight mb-8 mt-0">{children}</h2>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl md:text-3xl font-normal tracking-tight mt-12 mb-5 text-[#E8552D]">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl md:text-2xl font-normal tracking-tight mt-8 mb-4">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-5 text-base md:text-lg text-muted-foreground marker:text-[#E8552D]">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-5 text-base md:text-lg text-muted-foreground marker:text-[#E8552D]">{children}</ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-normal text-foreground">{children}</strong>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8552D] underline underline-offset-2 hover:text-foreground transition-colors"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="border-border my-8" />,
            blockquote: ({ children }) => (
              <blockquote className="border-l border-border pl-4 my-5 text-muted-foreground italic">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-card px-1.5 py-0.5 text-sm text-foreground">{children}</code>
            ),
          }}
        >
          {normalizedContent}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export function IntroPage() {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    loadIntroContent(controller.signal)
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [])

  const normalizedContent = useMemo(() => (content ? normalizeMarkdown(content) : ''), [content])

  if (loading) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>
        </div>
      </div>
    )
  }

  if (error || !normalizedContent) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-muted-foreground mb-6">Ошибка загрузки: {error ?? 'Неизвестная ошибка'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h2 className="text-3xl font-normal tracking-tight mb-8 mt-0">{children}</h2>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl md:text-3xl font-normal tracking-tight mt-12 mb-5 text-[#E8552D]">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl md:text-2xl font-normal tracking-tight mt-8 mb-4">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-5 text-base md:text-lg text-muted-foreground marker:text-[#E8552D]">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-5 text-base md:text-lg text-muted-foreground marker:text-[#E8552D]">{children}</ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-normal text-foreground">{children}</strong>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8552D] underline underline-offset-2 hover:text-foreground transition-colors"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="border-border my-8" />,
            blockquote: ({ children }) => (
              <blockquote className="border-l border-border pl-4 my-5 text-muted-foreground italic">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-card px-1.5 py-0.5 text-sm text-foreground">{children}</code>
            ),
          }}
        >
          {normalizedContent}
        </ReactMarkdown>
      </div>
    </div>
  )
}
