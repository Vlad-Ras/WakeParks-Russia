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
        Здесь заполняется каталог: города, вейк-парки, цены, отзывы, заявки владельцев и правки пользователей.
        Основной рабочий раздел — <b>«1. Wake каталог»</b> слева.
      </p>

      <div className={`${baseClass}__grid`}>
        <section>
          <h5>Быстрый порядок наполнения</h5>
          <ol className={`${baseClass}__instructions`}>
            <li>Создай город в разделе «Города».</li>
            <li>Загрузи изображения в «Медиафайлы» и заполни alt-текст.</li>
            <li>Создай парк, выбери город, статус «Опубликовано», фото, услуги и контакты.</li>
            <li>Добавь подробный прайс в разделе «Цены».</li>
            <li>Проверь, что у парка есть координаты и ссылка на Яндекс.Карты.</li>
          </ol>
        </section>

        <section>
          <h5>Что чаще всего забывают</h5>
          <ul className={`${baseClass}__instructions`}>
            <li>Парк не виден публично, если статус не «Опубликовано».</li>
            <li>Парк не появится на карте без широты и долготы.</li>
            <li>Для красивой карточки нужны главное изображение и краткое описание.</li>
            <li>Для SEO желательно заполнить title/description у города и парка.</li>
            <li>Отзывы, правки и заявки владельцев сначала требуют модерации.</li>
          </ul>
        </section>
      </div>

      <p className={`${baseClass}__links`}>
        <a href="/" target="_blank">Открыть сайт</a>
        <span> · </span>
        <a href="/wake-parks" target="_blank">Каталог парков</a>
        <span> · </span>
        <a href="/launch-checklist" target="_blank">Чеклист запуска</a>
      </p>
    </div>
  )
}

export default BeforeDashboard
