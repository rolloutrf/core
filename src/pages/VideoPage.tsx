import { useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useFetch } from '@/hooks/useFetch'

const RAW_URL = 'https://raw.githubusercontent.com/rolloutrf/data/main/Intro/%D0%A2%D0%B5%D0%BA%D1%81%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.md'

export function VideoPage() {
  const { data: content, loading, error } = useFetch<string>(RAW_URL)

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Видео</h1>
        <p className="text-muted-foreground mb-10 md:mb-16 max-w-lg leading-relaxed">
          Текст для презентационного видео о проекте
        </p>

        {loading && <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>}
        {error && <p className="text-muted-foreground text-sm">Ошибка загрузки: {error}</p>}

        {!loading && !error && content && (
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-normal tracking-tight mb-8 mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl md:text-2xl font-normal mt-10 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-normal mt-6 mb-2">{children}</h3>
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
