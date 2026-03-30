function StarLeft() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i * 15 * Math.PI) / 180
        const len = i % 2 === 0 ? 90 : 60
        return (
          <line
            key={i}
            x1="100" y1="100"
            x2={100 + Math.cos(angle) * len}
            y2={100 + Math.sin(angle) * len}
            stroke="#E8552D" strokeWidth="6"
          />
        )
      })}
      <circle cx="100" cy="100" r="40" fill="#E8552D" />
    </svg>
  )
}

function StarRight() {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i * 18 * Math.PI) / 180
        const len = i % 2 === 0 ? 85 : 55
        return (
          <line
            key={i}
            x1="100" y1="100"
            x2={100 + Math.cos(angle) * len}
            y2={100 + Math.sin(angle) * len}
            stroke="#E8552D" strokeWidth="7" strokeLinecap="round"
          />
        )
      })}
      <circle cx="100" cy="100" r="35" fill="#E8552D" />
    </svg>
  )
}

export function HowtoSection() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="border-t-2 border-[#E8552D] pt-10 md:pt-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex flex-col gap-5 md:gap-6">
            <h2 className="text-2xl md:text-4xl font-normal tracking-tight">
              Как тут всё устроено
            </h2>
            <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
              В остальном всё как в обычной продуктовой команде. Созваниваемся, генерим гипотезы,
              исследуем рынок и аудиторию, обсуждаем стратегию и макеты.
            </p>
            <div className="bg-card  aspect-[4/3] flex items-center justify-center mt-auto">
              <StarLeft />
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            <p className="text-[#E8552D] font-semibold text-lg md:text-2xl leading-relaxed">
              Роллаут — это некоммерческий проект, поэтому у нас нет зарплат. Участников объединяет
              только желание делиться опытом и вместе строить цифровую экономику.
            </p>
            <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
              Кстати, все готовые библиотеки открыты — можете{' '}
              <a href="https://www.figma.com/@rollout" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                побродить по макетам
              </a>{' '}
              и покомментировать.
            </p>
            <div className="bg-card  aspect-[4/3] flex items-center justify-center mt-auto">
              <StarRight />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
