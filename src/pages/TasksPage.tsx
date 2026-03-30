import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface GithubFile {
  name: string
  type: string
  download_url: string | null
  path: string
}

interface Task {
  name: string
  download_url: string
  module: string
}

const API_BASE = 'https://api.github.com/repos/rolloutrf/data/contents'

const moduleColors: Record<string, string> = {
  'History': 'bg-blue-950/60 text-blue-300',
  'PFM': 'bg-purple-950/60 text-purple-300',
  'Auth': 'bg-green-950/60 text-green-300',
  'Loyalty': 'bg-orange-950/60 text-orange-300',
}

function parseModuleName(dirName: string): string {
  const match = dirName.match(/^\d+\.\s+(.+)$/)
  return match ? match[1].trim() : dirName
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/Tasks`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const dirs: GithubFile[] = await res.json()

        const moduleDirs = dirs.filter((d) => d.type === 'dir')

        const results = await Promise.all(
          moduleDirs.map(async (dir) => {
            const r = await fetch(`${API_BASE}/${dir.path}`)
            if (!r.ok) return []
            const files: GithubFile[] = await r.json()
            const moduleName = parseModuleName(dir.name)
            return files
              .filter((f) => f.type === 'file' && f.name !== '.DS_Store' && f.download_url)
              .map((f) => ({
                name: f.name,
                download_url: f.download_url!,
                module: moduleName,
              }))
          })
        )

        if (!cancelled) {
          setTasks(results.flat())
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
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Задачи</h1>
        <p className="text-muted-foreground mb-12 max-w-lg leading-relaxed">
          Открытые задачи проекта — берите любую и присоединяйтесь к команде
        </p>

        {loading && <p className="text-muted-foreground text-sm animate-pulse">Загрузка…</p>}
        {error && <p className="text-muted-foreground text-sm">Ошибка загрузки: {error}</p>}

        {!loading && !error && (
          <div className="divide-y divide-border border-y border-border">
            {tasks.map((task) => (
              <Link
                key={task.name}
                to="/tasks/detail"
                state={{
                  rawUrl: task.download_url,
                  title: task.name,
                  backPath: '/tasks',
                  backLabel: 'Задачи',
                }}
                className="flex items-center justify-between py-4 group hover:bg-muted/30 px-2 -mx-2 rounded transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    moduleColors[task.module] ?? 'bg-muted text-muted-foreground'
                  }`}>
                    {task.module}
                  </span>
                  <span className="text-sm font-medium truncate">{task.name}</span>
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
