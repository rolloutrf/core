import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getCommunityInitials, parseCommunityMarkdown } from '@/lib/community'

export function CommunityPage() {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/data/community.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: { content: string }) => {
        if (!cancelled) {
          setContent(data.content)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  const people = useMemo(() => (content ? parseCommunityMarkdown(content) : []), [content])

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Комьюнити</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 md:mb-12 max-w-2xl leading-relaxed">
          Эксперты из финтеха, e-commerce и смежных областей
        </p>

        {loading && (
          <div className="text-muted-foreground animate-pulse">Загрузка…</div>
        )}

        {error && (
          <div className="text-muted-foreground">Ошибка загрузки: {error}</div>
        )}

        {!loading && !error && (
          <div className="divide-y divide-border border-y border-border">
            {people.map((person) => (
              <Link
                key={person.slug}
                to={`/community/${person.slug}`}
                className="py-6 md:py-8 flex gap-4 md:gap-6 hover:bg-muted/20 px-2 -mx-2 transition-colors"
              >
                {person.photoUrl ? (
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    className="size-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center text-sm font-normal text-muted-foreground shrink-0">
                    {getCommunityInitials(person.name)}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-normal text-lg">{person.name}</h3>
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
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{person.bio}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
