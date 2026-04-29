import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Админка Wake Parks Russia</h4>
      </Banner>
      <p>
        Здесь заполняются города, вейк-парки, фотографии, отзывы и правки пользователей. Для начала открой раздел
        «Wake каталог» слева.
      </p>
      <ul className={`${baseClass}__instructions`}>
        <li>Сначала создай город в разделе «Города».</li>
        <li>Затем добавь парк, выбери город, изображение карточки, услуги и цены.</li>
        <li>Публичные заявки и отзывы сначала попадают на модерацию.</li>
        <li>
          После публикации можно открыть сайт и проверить карточки: <a href="/" target="_blank">перейти на сайт</a>.
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
