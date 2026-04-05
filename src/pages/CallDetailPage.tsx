import { useLocation, useNavigate } from 'react-router-dom'

interface LocationState {
  title: string
  content: string // This will be the iframe src
  backPath: string
  backLabel: string
}

export function CallDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  if (!state?.content) {
    return (
      <div className="py-16 px-6 max-w-7xl mx-auto text-muted-foreground">
        Запись не найдена.{' '}
        <button onClick={() => navigate(-1)} className="underline underline-offset-2">
          Назад
        </button>
      </div>
    )
  }

  return (
    <div className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(state.backPath)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-10 flex items-center gap-1"
        >
          ← {state.backLabel}
        </button>

        <h1 className="text-3xl font-normal tracking-tight mb-8 mt-0">{state.title}</h1>
        
        <div className="border border-border rounded-lg overflow-hidden bg-black aspect-video">
          <iframe
            src={state.content}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}
