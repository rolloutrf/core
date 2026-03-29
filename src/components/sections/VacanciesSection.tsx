import { Link } from 'react-router-dom'

const vacancies = [
  { title: 'SMM-менеджер', file: 'SMM-%D0%BC%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80' },
  { title: 'Дизайнер в Авторизацию', file: '%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5%D1%80%20%D0%B2%20%D0%90%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8E' },
  { title: 'Дизайнер в Лояльность', file: '%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5%D1%80%20%D0%B2%20%D0%9B%D0%BE%D1%8F%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C' },
  { title: 'Дизайнер в команду дизайн-системы', file: '%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5%D1%80%20%D0%B2%20%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D1%83%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B' },
  { title: 'Менеджер по маркетингу продукта', file: '%D0%9C%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80%20%D0%BF%D0%BE%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%82%D0%B8%D0%BD%D0%B3%D1%83%20%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%B0%20(Product%20Markting%20Manager)' },
  { title: 'Менеджер проектов', file: '%D0%9C%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%BE%D0%B2%20(Project%20Manager)' },
  { title: 'Фронтенд-разработчик', file: '%D0%A4%D1%80%D0%BE%D0%BD%D1%82%D0%B5%D0%BD%D0%B4-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%87%D0%B8%D0%BA' },
]

const RAW_BASE = 'https://raw.githubusercontent.com/rolloutrf/data/main/Vacancy/'

export function VacanciesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-4">
          Кого мы ищем
        </h2>
        <p className="text-muted-foreground mb-16 max-w-lg leading-relaxed">
          Открытые позиции в Роллауте — присоединяйтесь к команде
        </p>
        <div className="divide-y divide-border border-y border-border">
          {vacancies.map((v) => (
            <Link
              key={v.title}
              to="/vacancies/detail"
              state={{
                rawUrl: `${RAW_BASE}${v.file}.md`,
                title: v.title,
                backPath: '/',
                backLabel: 'Главная',
              }}
              className="flex items-center justify-between py-5 group hover:text-muted-foreground transition-colors"
            >
              <span className="font-medium">{v.title}</span>
              <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
