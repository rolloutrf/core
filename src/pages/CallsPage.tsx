import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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

export function CallsPage() {
  const [calls, setCalls] = useState<CallFile[]>([])
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
          setCalls(normalizeCallsResponse(data))
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Звонки</h1>
        <p className="text-muted-foreground mb-10 md:mb-12 max-w-lg leading-relaxed">
          Архив записей созвонов Rollout
        </p>

        {loading && <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>}
        {error && <p className="text-muted-foreground text-sm">Ошибка загрузки: {error}</p>}

        {!loading && !error && (
          <div className="divide-y divide-border border-y border-border">
            {calls.map((call, index) => (
              <Link
                key={call.slug}
                to={`/созвоны/${call.slug}`}
                className="flex items-center justify-between py-5 group hover:bg-muted/30 px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-[#E8552D] text-sm shrink-0">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-normal truncate">{call.title}</span>
                </div>
                <span className="text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0 ml-4">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
