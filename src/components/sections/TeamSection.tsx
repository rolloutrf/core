import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    type: 'intro' as const,
    name: 'Команда Роллаута',
    role: 'Эксперты в финтехе и e‑commerce',
    photo: 'https://static.tildacdn.com/tild3064-6161-4665-a165-346139333234/Promo.png',
  },
  {
    type: 'person' as const,
    name: 'Саша Капустин',
    role: 'CEO Unirest IT, ex-CPO Avito Fintech, лектор EMBA Сколково и ФРИИ',
    photo: 'https://static.tildacdn.com/tild6461-3363-4863-b639-393134333339/_.png',
  },
  {
    type: 'person' as const,
    name: 'Миша Колосков',
    role: 'Арт-директор Avito Fintech, ex‑Design Lead B2C‑продуктов в Яндекс.Деньгах',
    photo: 'https://static.tildacdn.com/tild3739-3538-4066-a562-656131386530/_.png',
  },
  {
    type: 'person' as const,
    name: 'Арина Московская',
    role: 'Продуктовый дизайнер в Альфа-Банке, ex-дизайнер MTC Digital',
    photo: 'https://static.tildacdn.com/tild6235-3432-4336-a330-353032396664/_.png',
  },
  {
    type: 'person' as const,
    name: 'Саша Желонкин',
    role: 'Менеджер проектов в группе эффективности платежей, Яндекс',
    photo: 'https://static.tildacdn.com/tild6663-3835-4638-b065-343834333632/_.png',
  },
  {
    type: 'person' as const,
    name: 'Надя Лебедева',
    role: 'Продуктовый дизайнер в Red Collar',
    photo: 'https://static.tildacdn.com/tild3133-3638-4332-b632-663938623830/_.png',
  },
  {
    type: 'person' as const,
    name: 'София Ленивая',
    role: 'UX/UI-дизайнер',
    photo: 'https://static.tildacdn.com/tild3036-6435-4432-b539-643964373966/_.png',
  },
  {
    type: 'person' as const,
    name: 'Наташа Кожемяко',
    role: 'Продуктовый дизайнер',
    photo: 'https://static.tildacdn.com/tild3962-3734-4161-a665-333834663439/_.png',
  },
  {
    type: 'person' as const,
    name: 'Марина Чернявцева',
    role: 'Freelance UX/UI-дизайнер, ex-Lead Designer AWADA (Varton Group)',
    photo: 'https://static.tildacdn.com/tild3430-3137-4130-a636-326665356636/Cherniavtseva_Marina.png',
  },
  {
    type: 'person' as const,
    name: 'Тали Шайхзаде',
    role: 'Продуктовый дизайнер',
    photo: 'https://static.tildacdn.com/tild3134-6664-4566-b163-656234633337/_.png',
  },
]

const GAP = 24

function getLayout(w: number): { cardWidth: number; itemsPerView: number } {
  if (w < 640) return { cardWidth: w - 72, itemsPerView: 1 }
  if (w < 1024) return { cardWidth: 320, itemsPerView: 2 }
  return { cardWidth: 420, itemsPerView: 3 }
}

export function TeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [layout, setLayout] = useState(() => getLayout(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  ))

  useEffect(() => {
    function update() {
      setLayout(getLayout(window.innerWidth))
      setCurrentIndex(0)
    }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { cardWidth, itemsPerView } = layout
  const maxIndex = Math.max(0, slides.length - itemsPerView)

  const next = () => { if (currentIndex < maxIndex) setCurrentIndex(currentIndex + 1) }
  const prev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1) }

  return (
    <section className="py-16 md:py-24 overflow-hidden relative">
      {/* Mobile nav arrows — above carousel */}
      <div className="md:hidden px-6 flex justify-end gap-2 mb-5">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="size-10 rounded-full bg-[#E8552D] hover:bg-[#E8552D]/80 disabled:opacity-30 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="size-4 text-white" />
        </button>
        <button
          onClick={next}
          disabled={currentIndex >= maxIndex}
          className="size-10 rounded-full bg-[#E8552D] hover:bg-[#E8552D]/80 disabled:opacity-30 flex items-center justify-center transition-all"
        >
          <ChevronRight className="size-4 text-white" />
        </button>
      </div>

      {/* Desktop nav arrows — absolute */}
      <button
        onClick={prev}
        disabled={currentIndex === 0}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-[#E8552D] hover:bg-[#E8552D]/80 disabled:opacity-0 items-center justify-center transition-all"
      >
        <ChevronLeft className="size-5 text-white" />
      </button>
      <button
        onClick={next}
        disabled={currentIndex >= maxIndex}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-[#E8552D] hover:bg-[#E8552D]/80 disabled:opacity-0 items-center justify-center transition-all"
      >
        <ChevronRight className="size-5 text-white" />
      </button>

      <div className="-mx-6 pl-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2))]">
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (cardWidth + GAP)}px)` }}
        >
          {slides.map((slide) => (
            <div key={slide.name} className="flex-none flex flex-col gap-3 md:gap-4" style={{ width: cardWidth }}>
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={slide.photo}
                  alt={slide.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium text-xl md:text-2xl">{slide.name}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{slide.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
