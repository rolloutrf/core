import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchCached } from '@/lib/fetchCached'

interface GithubFile {
  name: string
  type: string
  download_url: string | null
  path: string
}

interface Spec {
  title: string
  download_url: string
  dirName: string
}

const API_BASE = 'https://api.github.com/repos/rolloutrf/data/contents'

function parseTitle(fileName: string): string {
  const match = fileName.match(/^\d+\.\s+(.+)\.md$/)
  return match ? match[1].trim() : fileName.replace('.md', '')
}

export function SpecsPage() {
  const [specs, setSpecs] = useState<Spec[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetchCached(`${API_BASE}/Specs`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const dirs: GithubFile[] = await res.json()

        const specDirs = dirs
          .filter((d) => d.type === 'dir')
          .sort((a, b) => parseInt(a.name) - parseInt(b.name))

        const results = await Promise.all(
          specDirs.map(async (dir) => {
            const r = await fetchCached(`${API_BASE}/${dir.path}`)
            if (!r.ok) return null
            const files: GithubFile[] = await r.json()
            const mdFile = files.find(
              (f) => f.type === 'file' && f.name.endsWith('.md') && f.download_url
            )
            if (!mdFile) return null
            return {
              title: parseTitle(mdFile.name),
              download_url: mdFile.download_url!,
              dirName: dir.name,
            }
          })
        )

        if (!cancelled) {
          setSpecs(results.filter(Boolean) as Spec[])
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
                  rawUrl: spec.download_url,
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
