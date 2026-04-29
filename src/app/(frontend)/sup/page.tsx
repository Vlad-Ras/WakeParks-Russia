import { ThemeLanding } from '../_wake/themeLanding'
import { getParks } from '../_wake/queries'

export const metadata = {
  title: 'SUP и вейк-парки России — аренда SUP, пляж и активный отдых',
  description: 'Подборка вейк-парков России, где есть SUP, пляжная зона, аренда досок и формат отдыха у воды.',
}

export default async function SupPage() {
  const parks = (await getParks(1000)).filter((park) => park.features?.supRent || park.features?.beach)

  return (
    <ThemeLanding
      config={{
        title: 'Вейк-парки с SUP и отдыхом у воды',
        eyebrow: 'SUP и вода',
        description:
          'Подборка парков, где помимо вейкборда есть SUP, пляжная зона или формат спокойного отдыха у воды. Хорошо подходит для компании с разными интересами.',
        emptyTitle: 'Пока нет парков с SUP или пляжем',
        emptyDescription: 'Отметь услуги «SUP» или «Пляж / зона отдыха» у парков в админке, чтобы они появились в подборке.',
        chips: ['SUP', 'Пляж', 'Аренда', 'Компания', 'Отдых у воды'],
        checklist: [
          'Проверь стоимость SUP по часам и условия залога.',
          'Уточни, работает ли SUP при ветре и плохой погоде.',
          'Посмотри наличие пляжной зоны, кафе, душа и раздевалки.',
          'Если едешь компанией, проверь, есть ли беседки или зона отдыха.',
        ],
      }}
      parks={parks}
    />
  )
}
