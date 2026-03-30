import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Spec {
  title: string
  dirName: string
  content: string
}

export function SpecsPage() {
  const [specs, setSpecs] = useState<Spec[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/data/specs.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: Spec[]) => {
        if (!cancelled) {
          setSpecs(data)
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

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Спецификации</h1>
        <p className="text-muted-foreground mb-12 max-w-lg leading-relaxed">
          Функциональные спецификации для каждого модуля платформы
        </p>

        {loading && <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>}
        {error && <p className="text-muted-foreground text-sm">Ошибка загрузки: {error}</p>}

        {!loading && !error && (
          <div className="divide-y divide-border border-y border-border">
            {specs.map((spec) => (
              <Link
                key={spec.dirName}
                to="/specs/detail"
                state={{
                  content: spec.content,
                  title: spec.title,
                  backPath: '/specs',
                  backLabel: 'Спецификации',
                }}
                className="flex items-center justify-between py-5 group hover:text-muted-foreground transition-colors"
              >
                <span className="font-normal">{spec.title}</span>
                <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
