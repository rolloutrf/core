import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCommunityInitials, parseCommunityMarkdown } from '@/lib/community'

export function CommunityMemberPage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/data/community.json')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data: { content: string }) => {
        if (!cancelled) {
          setContent(data.content)
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

  const person = useMemo(() => {
    if (!content) return null
    return parseCommunityMarkdown(content).find((entry) => entry.slug === slug) ?? null
  }, [content, slug])

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

  if (!person) {
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
          onClick={() => navigate('/community')}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-10 flex items-center gap-1"
        >
          ← Комьюнити
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 border border-border bg-card p-6 md:p-8">
          {person.photoUrl ? (
            <img
              src={person.photoUrl}
              alt={person.name}
              className="w-24 h-24 md:w-32 md:h-32 object-cover shrink-0"
            />
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 bg-muted flex items-center justify-center text-2xl font-normal text-muted-foreground shrink-0">
              {getCommunityInitials(person.name)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-normal tracking-tight">{person.name}</h1>
              {person.telegram && (
                <a
                  href={person.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#E8552D] hover:underline"
                >
                  Telegram
                </a>
              )}
            </div>

            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{person.bio}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
