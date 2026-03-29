function Star1() {
  return (
    <svg viewBox="0 0 200 200" className="w-28 h-28">
      {Array.from({ length: 36 }, (_, i) => {
        const angle = (i * 10 * Math.PI) / 180
        const len = i % 2 === 0 ? 90 : 60
        return (
          <line
            key={i}
            x1="100" y1="100"
            x2={100 + Math.cos(angle) * len}
            y2={100 + Math.sin(angle) * len}
            stroke="#E8552D" strokeWidth="3"
          />
        )
      })}
      <circle cx="100" cy="100" r="30" fill="#E8552D" />
    </svg>
  )
}

function Star2() {
  return (
    <svg viewBox="0 0 200 200" className="w-28 h-28">
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i * 15 * Math.PI) / 180
        const len = i % 2 === 0 ? 85 : 65
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

function Star3() {
  return (
    <svg viewBox="0 0 200 200" className="w-28 h-28">
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i * 18 * Math.PI) / 180
        return (
          <line
            key={i}
            x1="100" y1="100"
            x2={100 + Math.cos(angle) * 80}
            y2={100 + Math.sin(angle) * 80}
            stroke="#E8552D" strokeWidth="5"
          />
        )
      })}
      <circle cx="100" cy="100" r="35" fill="#E8552D" />
      <circle cx="100" cy="100" r="20" fill="#E8552D" />
    </svg>
  )
}

function Star4() {
  const points = Array.from({ length: 8 }, (_, i) => {
    const outerAngle = (i * 45 * Math.PI) / 180
    const innerAngle = ((i * 45 + 22.5) * Math.PI) / 180
    const ox = 100 + Math.cos(outerAngle) * 85
    const oy = 100 + Math.sin(outerAngle) * 85
    const ix = 100 + Math.cos(innerAngle) * 35
    const iy = 100 + Math.sin(innerAngle) * 35
    return `${ox},${oy} ${ix},${iy}`
  }).join(' ')

  return (
    <svg viewBox="0 0 200 200" className="w-28 h-28">
      <polygon points={points} fill="#E8552D" />
    </svg>
  )
}

const stars = [Star1, Star2, Star3, Star4]

const offers = [
  {
    num: '01',
    title: 'Свободный график.',
    desc: 'Можно работать хоть по 2, хоть по 40 часов в неделю — как вам самим будет комфортно',
  },
  {
    num: '02',
    title: 'Задачи разного уровня.',
    desc: 'Новички смогут отточить навыки, а опытные — перепридумать стандарты индустрии',
  },
  {
    num: '03',
    title: 'Никакой бюрократии.',
    desc: 'Подхватываем самые смелые задумки и открыто обсуждаем идеи каждого участника',
  },
  {
    num: '04',
    title: 'Сильное комьюнити.',
    desc: 'Мы не соперничаем, а объединяем силы и делимся опытом, чтобы найти решения для будущего',
  },
]

export function OfferSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-16">
          Что можем предложить
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((item, i) => {
            const StarIcon = stars[i]
            return (
              <div key={item.num} className="flex flex-col gap-5">
                <div className="bg-card  aspect-square flex items-center justify-center">
                  <StarIcon />
                </div>
                <span className="text-[#E8552D] text-3xl">{item.num}</span>
                <p className="text-xl leading-relaxed">
                  <span className="text-[#E8552D]">{item.title}</span>{' '}
                  <span className="text-muted-foreground">{item.desc}</span>
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
