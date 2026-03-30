import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Главная' },
  { to: '/tasks', label: 'Задачи' },
  { to: '/specs', label: 'Спецификации' },
  { to: '/community', label: 'Комьюнити' },
  { to: '/checklist', label: 'Чеклист' },
  { to: '/video', label: 'Видео' },
  { to: '/calls', label: 'Звонки' },
]

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
        <img src="https://static.tildacdn.com/tild3466-6438-4330-b739-303166383362/favi.png" alt="Rollout" className="h-5 w-5 mr-4 shrink-0" />
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors',
                isActive
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
