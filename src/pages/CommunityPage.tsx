import { useState, useEffect, useMemo } from 'react'

interface Person {
  name: string
  bio: string
  photoUrl: string | null
  telegram: string | null
}

function parseMarkdown(md: string): Person[] {
  const sections = md.split(/^## /m).slice(1)
  return sections.map((section) => {
    const lines = section.split('\n')
    const name = lines[0].trim()

    const photoMatch = section.match(/!\[.*?\]\((photos\/[^\)]+)\)/)
    const photoUrl = photoMatch ? '/data/community-photos/' + photoMatch[1].replace('photos/', '') : null

    const telegramMatch = section.match(/Telegram:\s*(https?:\/\/\S+)/)
    const telegram = telegramMatch ? telegramMatch[1] : null

    const bio = lines
      .slice(1)
      .filter((l) => !l.startsWith('![') && !l.startsWith('Telegram:') && l.trim() !== '---')
      .join('\n')
      .trim()

    return { name, bio, photoUrl, telegram }
  }).filter((p) => p.name && p.bio)
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

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

  const people = useMemo(() => (content ? parseMarkdown(content) : []), [content])

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
              <div key={person.name} className="py-6 md:py-8 flex gap-4 md:gap-6">
                {person.photoUrl ? (
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    className="size-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center text-sm font-normal text-muted-foreground shrink-0">
                    {initials(person.name)}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
