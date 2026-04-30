import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface HowtoItem {
  slug: string
  title: string
  content: string
}

export function FrontendPage() {
  const [items, setItems] = useState<HowtoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/data/howto.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: HowtoItem[]) => {
        if (!cancelled) {
          setItems(data)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Фронтенд</h1>
        <p className="text-muted-foreground mb-12 max-w-lg leading-relaxed">
          Гайды по разработке интерфейсов в экосистеме Роллаута
        </p>

        {loading && <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>}
        {error && <p className="text-muted-foreground text-sm">Ошибка загрузки: {error}</p>}

        {!loading && !error && (
          <div className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <Link
                key={item.slug}
                to={`/frontend/${item.slug}`}
                className="flex items-center justify-between py-5 group hover:text-muted-foreground transition-colors"
              >
                <span className="font-normal">{item.title}</span>
                <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
