import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const ONBOARDING_RAW_URL = 'https://raw.githubusercontent.com/rolloutrf/data/main/Onboarding/Onboarding.md'

interface OnboardingItem {
  content: string
}

interface OnboardingResponse {
  content?: string
}

function linkifyMarkdown(markdown: string) {
  return markdown.replace(/https?:\/\/[^\s)]+/g, (url) => `<${url}>`)
}

function normalizeMarkdown(markdown: string) {
  return linkifyMarkdown(markdown.replace(/\r\n/g, '\n').trim())
}

function normalizeOnboardingResponse(data: OnboardingItem[] | OnboardingResponse) {
  if (Array.isArray(data)) {
    return data[0]?.content ?? ''
  }

  return data.content ?? ''
}

async function loadOnboardingContent(signal: AbortSignal) {
  try {
    const response = await fetch(ONBOARDING_RAW_URL, { signal })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.text()
  } catch {
    const fallbackResponse = await fetch('/data/onboarding.json', { signal })

    if (!fallbackResponse.ok) {
      throw new Error(`HTTP ${fallbackResponse.status}`)
    }

    const fallbackData = await fallbackResponse.json() as OnboardingItem[] | OnboardingResponse
    const fallbackContent = normalizeOnboardingResponse(fallbackData)

    if (!fallbackContent) {
      throw new Error('Пустой ответ')
    }

    return fallbackContent
  }
}

export function OnboardingPage() {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    loadOnboardingContent(controller.signal)
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
          <p className="text-muted-foreground">Ошибка загрузки: {error ?? 'Неизвестная ошибка'}</p>
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
              <ul className="list-disc list-outside pl-5 space-y-1 mb-4 text-muted-foreground">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside pl-5 space-y-1 mb-4 text-muted-foreground">{children}</ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => <strong className="font-normal text-foreground">{children}</strong>,
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
          }}
        >
          {normalizedContent}
        </ReactMarkdown>
      </div>
    </div>
  )
}
