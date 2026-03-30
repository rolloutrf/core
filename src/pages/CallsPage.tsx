import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface GithubFile {
  name: string
  type: string
  download_url: string | null
}

interface CallFile {
  title: string
  download_url: string
}

const API = 'https://api.github.com/repos/rolloutrf/data/contents/Calls'

function parseTitle(fileName: string): string {
  return fileName.replace(/\.md$/i, '')
}

export function CallsPage() {
  const [calls, setCalls] = useState<CallFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(API)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const files: GithubFile[] = await res.json()

        const mdFiles = files
          .filter((f) => f.type === 'file' && f.name.endsWith('.md') && f.download_url)
          .map((f) => ({
            title: parseTitle(f.name),
            download_url: f.download_url!,
          }))

        if (!cancelled) {
          setCalls(mdFiles)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Звонки</h1>
        <p className="text-muted-foreground mb-10 md:mb-12 max-w-lg leading-relaxed">
          Записи встреч команды
        </p>

        {loading && <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>}
        {error && <p className="text-muted-foreground text-sm">Ошибка загрузки: {error}</p>}

        {!loading && !error && (
          <div className="divide-y divide-border border-y border-border">
            {calls.map((call) => (
              <Link
                key={call.title}
                to="/calls/detail"
                state={{
                  rawUrl: call.download_url,
                  title: call.title,
                  backPath: '/calls',
                  backLabel: 'Звонки',
                }}
                className="flex items-center justify-between py-5 group hover:text-muted-foreground transition-colors"
              >
                <span className="font-normal">{call.title}</span>
                <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
