import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Vacancy {
  slug: string
  title: string
  content: string
}

export function VacanciesSection() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])

  useEffect(() => {
    fetch('/data/vacancies.json')
      .then((r) => r.ok ? r.json() : [])
      .then((data: Vacancy[]) => setVacancies(data))
      .catch(() => {})
  }, [])

  if (vacancies.length === 0) return null

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-normal tracking-tight mb-4">
          Кого мы ищем
        </h2>
        <p className="text-muted-foreground mb-10 md:mb-16 max-w-lg leading-relaxed">
          Открытые позиции в Роллауте — присоединяйтесь к команде
        </p>
        <div className="divide-y divide-border border-y border-border">
          {vacancies.map((v) => (
            <Link
              key={v.slug}
              to={`/vacancies/${v.slug}`}
              className="flex items-center justify-between py-5 group hover:text-muted-foreground transition-colors"
            >
              <span className="font-normal">{v.title}</span>
              <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
