import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const ONBOARDING_RAW_URL = 'https://raw.githubusercontent.com/rolloutrf/data/main/Onboarding/Onboarding.md'

interface OnboardingItem {
  slug: string
  title: string
  content: string
}

interface OnboardingResponse {
  content?: string
}

interface OnboardingStep {
  number: string
  content: string
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

function parseOnboarding(markdown: string) {
  const normalized = normalizeMarkdown(markdown)
  const lines = normalized.split('\n')
  const titleLine = lines.find((line) => line.startsWith('# '))
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : 'Онбординг'
  const projectIndex = lines.findIndex((line) => line.trim() === 'Пара слов про Роллаут')
  const stepsIndex = lines.findIndex((line) => line.trim() === 'Что теперь делать')

  const intro = projectIndex === -1
    ? lines.slice(titleLine ? lines.indexOf(titleLine) + 1 : 0).join('\n').trim()
    : lines.slice(titleLine ? lines.indexOf(titleLine) + 1 : 0, projectIndex).join('\n').trim()

  const about = projectIndex === -1 || stepsIndex === -1
    ? ''
    : lines.slice(projectIndex + 1, stepsIndex).join('\n').trim()

  const stepLines = stepsIndex === -1 ? [] : lines.slice(stepsIndex + 1)
  const steps: OnboardingStep[] = []
  let currentStep: OnboardingStep | null = null

  for (const line of stepLines) {
    const match = line.match(/^(\d+)\.\s+(.*)$/)

    if (match) {
      if (currentStep) {
        steps.push({
          ...currentStep,
          content: currentStep.content.trim(),
        })
      }

      currentStep = {
        number: match[1],
        content: match[2],
      }

      continue
    }

    if (currentStep) {
      currentStep.content = `${currentStep.content}\n${line}`
    }
  }

  if (currentStep) {
    steps.push({
      ...currentStep,
      content: currentStep.content.trim(),
    })
  }

  return { title, intro, about, steps }
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

function MarkdownBlock({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
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
        strong: ({ children }) => <strong className="font-normal text-foreground">{children}</strong>,
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
      }}
    >
      {content}
    </ReactMarkdown>
  )
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

  const onboarding = useMemo(() => (content ? parseOnboarding(content) : null), [content])

  if (loading) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Онбординг</h1>
          <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>
        </div>
      </div>
    )
  }

  if (error || !onboarding) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Онбординг</h1>
          <p className="text-muted-foreground">Ошибка загрузки: {error ?? 'Неизвестная ошибка'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-6">{onboarding.title}</h1>
          <MarkdownBlock content={onboarding.intro} />
        </section>

        {onboarding.about && (
          <section className="mb-16 border-t border-border pt-8">
            <h2 className="text-2xl md:text-3xl font-normal tracking-tight mb-6">
              Пара слов <span className="text-[#E8552D]">про Роллаут</span>
            </h2>
            <MarkdownBlock content={onboarding.about} />
          </section>
        )}

        {onboarding.steps.length > 0 && (
          <section className="border-t border-border pt-8">
            <h2 className="text-2xl md:text-3xl font-normal tracking-tight mb-8">
              Что теперь <span className="text-[#E8552D]">делать</span>
            </h2>

            <div className="space-y-6">
              {onboarding.steps.map((step) => (
                <article key={step.number} className="border border-border bg-card p-6">
                  <div className="text-[#E8552D] text-sm mb-4">Шаг {step.number}</div>
                  <MarkdownBlock content={step.content} />
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
