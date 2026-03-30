import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchCached } from '@/lib/fetchCached'

interface GithubFile {
  name: string
  type: string
  download_url: string | null
}

interface Article {
  title: string
  download_url: string
}

const API = 'https://api.github.com/repos/rolloutrf/data/contents/Articles'

function parseTitle(fileName: string): string {
  return fileName.replace(/\.md$/i, '')
}

export function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetchCached(API)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const files: GithubFile[] = await res.json()

        const mdFiles = files
          .filter((f) => f.type === 'file' && f.name.endsWith('.md') && f.download_url)
          .map((f) => ({
            title: parseTitle(f.name),
            download_url: f.download_url!,
          }))

        if (!cancelled) {
          setArticles(mdFiles)
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
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Публикации</h1>
        <p className="text-muted-foreground mb-10 md:mb-12 max-w-lg leading-relaxed">
          Статьи и материалы команды Роллаута
        </p>

        {loading && <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>}
        {error && <p className="text-muted-foreground text-sm">Ошибка загрузки: {error}</p>}

        {!loading && !error && (
          <div className="divide-y divide-border border-y border-border">
            {articles.map((article) => (
              <Link
                key={article.title}
                to="/articles/detail"
                state={{
                  rawUrl: article.download_url,
                  title: article.title,
                  backPath: '/articles',
                  backLabel: 'Публикации',
                }}
                className="flex items-center justify-between py-5 group hover:text-muted-foreground transition-colors"
              >
                <span className="font-normal">{article.title}</span>
                <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
