import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Task {
  slug: string
  name: string
  module: string
  content: string
}

const moduleColors: Record<string, string> = {
  'History': 'bg-blue-950/60 text-blue-300',
  'PFM': 'bg-purple-950/60 text-purple-300',
  'Auth': 'bg-green-950/60 text-green-300',
  'Loyalty': 'bg-orange-950/60 text-orange-300',
  'AI': 'bg-cyan-950/60 text-cyan-300',
  'ID': 'bg-rose-950/60 text-rose-300',
  'Snippets': 'bg-yellow-950/60 text-yellow-300',
  'Payments': 'bg-emerald-950/60 text-emerald-300',
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/data/tasks.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: Task[]) => {
        if (!cancelled) {
          setTasks(data)
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
                key={task.slug}
                to={`/задачи/${task.slug}`}
                className="flex items-center justify-between py-4 group hover:bg-muted/30 px-2 -mx-2 rounded transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-normal ${
                    moduleColors[task.module] ?? 'bg-muted text-muted-foreground'
                  }`}>
                    {task.module}
                  </span>
                  <span className="text-sm font-normal truncate">{task.name}</span>
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
