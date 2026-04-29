export const cableTypeLabels: Record<string, string> = {
  ringCable: 'Кольцевая канатка',
  reverseCable: 'Реверсивная канатка',
  boatWake: 'Катерный вейк',
  winch: 'Лебёдка',
}

export const featureLabels: Record<string, string> = {
  training: 'Обучение',
  equipmentRent: 'Аренда оборудования',
  kidsSchool: 'Детская школа',
  supRent: 'SUP',
  cafe: 'Кафе',
  shower: 'Душ',
  changingRoom: 'Раздевалка',
  parking: 'Парковка',
  beach: 'Пляж / зона отдыха',
}

export const featureGroups = [
  {
    title: 'Катание и обучение',
    description: 'Всё, что влияет на сам процесс катания.',
    keys: ['training', 'kidsSchool', 'equipmentRent'],
  },
  {
    title: 'Вода и активности',
    description: 'Дополнительный отдых рядом с вейком.',
    keys: ['supRent', 'beach'],
  },
  {
    title: 'Инфраструктура',
    description: 'Комфорт до и после катания.',
    keys: ['cafe', 'shower', 'changingRoom', 'parking'],
  },
]

export function getGroupedActiveFeatures(features?: Record<string, boolean | undefined>) {
  return featureGroups
    .map((group) => ({
      ...group,
      items: group.keys.filter((key) => Boolean(features?.[key])),
    }))
    .filter((group) => group.items.length > 0)
}
