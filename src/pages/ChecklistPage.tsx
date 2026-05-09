import { useState } from 'react'

const items = [
  'Страница оформлена в соответствии с общепринятым стилем оформления.',
  'На странице присутствуют только компоненты. Все референсы перенесены в соответствующий файл с research.',
  'Все компоненты взяты из дизайн-системы shadcn/ui.',
  'Стандартные компоненты не кастомизированы (использованы в исходном виде).',
  'Все кастомные элементы вынесены на общее обсуждение и помечены как кастомные компоненты.',
  'Для всех отступов и скруглений использованы переменные (variables).',
  'Все цвета используются из палитры shadcn/ui.',
  'Все тексты привязаны к текстовым стилям shadcn/ui.',
  'Соблюдён общий вертикальный ритм — интервалы между блоками кратны 28 px.',
  'Названия компонентов соответствуют гайдлайну по неймингу.',
  'Общие компоненты вынесены на уровень common.',
  'Соблюдён логичный порядок слоёв.',
  'В макетах отсутствуют лишние обёрточные элементы.',
  'В слоях нет скрытых элементов.',
  'Названия слоёв логичные и понятные.',
  'Проверена корректность Layout и его поведения при ресайзе.',
  'Макеты адаптированы для минимального и максимального разрешений экрана.',
  'Макеты протестированы с минимальным и максимальным объёмом текстового содержимого.',
  'Все компоненты корректно отображаются в тёмной теме.',
  'Контрастность и визуальное оформление соответствуют требованиям доступности (WCAG).',
  'Все компоненты актуальны (обновлены до последней версии).',
  'Макеты связаны с актуальной библиотекой дизайн-системы.',
]

export function ChecklistPage() {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev)

      if (next.has(i)) {
        next.delete(i)
      } else {
        next.add(i)
      }

      return next
    })
  }

  const progress = Math.round((checked.size / items.length) * 100)

  return (
    <div className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">Figma Checklist</h1>
        <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
          Чеклист для проверки Figma-макетов перед ревью
        </p>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Прогресс</span>
            <span className="text-sm font-normal">{checked.size} / {items.length}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {items.map((item, i) => (
            <label
              key={i}
              className="flex items-start gap-4 py-4 cursor-pointer group hover:bg-muted/20 px-2 -mx-2 rounded transition-colors"
            >
              <div className={`mt-0.5 size-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                checked.has(i)
                  ? 'bg-foreground border-foreground'
                  : 'border-border group-hover:border-foreground/50'
              }`}>
                {checked.has(i) && (
                  <svg className="size-2.5 text-background" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={checked.has(i)}
                onChange={() => toggle(i)}
              />
              <span className={`text-sm leading-relaxed transition-colors ${
                checked.has(i) ? 'line-through text-muted-foreground' : ''
              }`}>
                {item}
              </span>
            </label>
          ))}
        </div>

        {checked.size === items.length && (
          <div className="mt-8 p-4 border border-border rounded-lg text-sm text-center text-muted-foreground">
            Все пункты выполнены — макет готов к ревью ✓
          </div>
        )}
      </div>
    </div>
  )
}
