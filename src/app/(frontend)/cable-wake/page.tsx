import { ThemeLanding } from '../_wake/themeLanding'
import { getParks } from '../_wake/queries'

export const metadata = {
  title: 'Канатный вейкборд — кольцевые и реверсивные канатки России',
  description: 'Вейк-парки России с кольцевой или реверсивной канаткой: цены, города, услуги, обучение и контакты.',
}

export default async function CableWakePage() {
  const parks = (await getParks(1000)).filter((park) => {
    const types = park.cableTypes || []
    return types.includes('ringCable') || types.includes('reverseCable') || types.includes('winch')
  })

  return (
    <ThemeLanding
      config={{
        title: 'Канатный вейкборд: кольцевые и реверсивные канатки',
        eyebrow: 'Cable wake',
        description:
          'Подборка парков с канатным вейкбордом: кольцевые трассы, реверсивные установки и лебёдки. Удобно для райдеров, которые выбирают именно тип тяги.',
        emptyTitle: 'Пока нет парков с канатным вейком',
        emptyDescription: 'Укажи типы катания у парков в админке: кольцевая, реверсивная или лебёдка.',
        chips: ['Кольцевая канатка', 'Реверсивная канатка', 'Лебёдка', 'Фигуры', 'Трасса'],
        checklist: [
          'Уточни тип канатки: кольцевая, реверсивная или лебёдка.',
          'Проверь, есть ли фигуры и подходят ли они под твой уровень.',
          'Посмотри формат оплаты: сет, час, абонемент или дневной билет.',
          'Перед поездкой проверь расписание и загруженность парка.',
        ],
      }}
      parks={parks}
    />
  )
}
