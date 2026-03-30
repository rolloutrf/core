export function HeroSection() {
  return (
    <section className="min-h-[85vh] flex items-center py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-4xl md:text-7xl max-w-6xl mb-6 leading-tight font-normal">
          Создаём опенсорс-платформу <span className="text-[#E8552D]">для любого e-com или финтех‑проекта</span>
        </h1>
        <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mb-8 md:mb-12 leading-relaxed">
          С нами уже больше сотни увлечённых ребят. Мы верим, что чем меньше барьеров
          для новых цифровых продуктов, тем больше пользы для всех участников рынка.
          Если вам это близко — ждём в Роллауте!
        </p>
        <a
          href="https://forms.yandex.ru/u/68f139e102848f52318c1da2/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full text-sm font-medium hover:opacity-75 transition-opacity"
        >
          Присоединиться →
        </a>
      </div>
    </section>
  )
}
