import { Link } from 'react-router-dom'

const RAW = 'https://raw.githubusercontent.com/rolloutrf/data/main/Specs/'

const specs = [
  { num: '0', title: 'Как работает банк?', file: '0.Как работает банк?.md' },
  { num: '1', title: 'Авторизация', file: '1. Авторизация.md' },
  { num: '2', title: 'Идентификация', file: '2. Идентификация.md' },
  { num: '3', title: 'Профиль', file: '3. Профиль.md' },
  { num: '4', title: 'Сниппеты (Выдача)', file: '4. Сниппеты (Выдача).md' },
  { num: '5', title: 'Карточка товара', file: '5. Карточка товара.md' },
  { num: '10', title: 'История операций', file: '10. История операций.md' },
  { num: '11', title: 'PFM', file: '11. PFM.md' },
  { num: '12', title: 'Лояльность', file: '12. Лояльность.md' },
  { num: '13', title: 'Кредиты', file: '13. Кредиты.md' },
]

export function SpecsPage() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Спецификации</h1>
        <p className="text-muted-foreground mb-12 max-w-lg leading-relaxed">
          Функциональные спецификации для каждого модуля платформы
        </p>

        <div className="divide-y divide-border border-y border-border">
          {specs.map((spec) => (
            <Link
              key={spec.file}
              to="/specs/detail"
              state={{
                rawUrl: RAW + encodeURIComponent(spec.file),
                title: spec.title,
                backPath: '/specs',
                backLabel: 'Спецификации',
              }}
              className="flex items-center justify-between py-5 group hover:text-muted-foreground transition-colors"
            >
              <span className="font-medium">{spec.title}</span>
              <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
