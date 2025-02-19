import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '..'
import { Image } from 'react-bootstrap'
import '../scss/components/_typeCard.scss'
import { SHOP_ROUTE } from '../utils/consts'
import { useLocation, useNavigate } from 'react-router-dom'

import cat1 from '../assets/types/1.webp'
import cat2 from '../assets/types/2.webp'
import cat3 from '../assets/types/3.webp'
import cat4 from '../assets/types/4.webp'
import cat5 from '../assets/types/5.webp'
import cat6 from '../assets/types/6.webp'
import cat7 from '../assets/types/7.webp'
import cat8 from '../assets/types/8.webp'
import cat9 from '../assets/types/9.webp'
import cat10 from '../assets/types/10.webp'
import cat11 from '../assets/types/11.webp'
import cat12 from '../assets/types/12.webp'
import cat13 from '../assets/types/13.webp'
import cat14 from '../assets/types/14.webp'
import cat15 from '../assets/types/15.webp'
import cat16 from '../assets/types/16.webp'
import cat17 from '../assets/types/17.webp'
import cat18 from '../assets/types/18.webp'
import cat19 from '../assets/types/19.webp'
import cat20 from '../assets/types/20.webp'
import cat21 from '../assets/types/21.webp'
import cat22 from '../assets/types/22.webp'
import cat23 from '../assets/types/23.webp'
import cat24 from '../assets/types/24.webp'
import cat25 from '../assets/types/25.webp'
import cat26 from '../assets/types/26.webp'

const typeImages = {
  'Школьные и офисные принадлежности': cat1,
  'Инструмент ручной': cat2,
  Электроинструмент: cat3,
  'Сварочное оборудование': cat4,
  'Товары для сада и огорода': cat5,
  'Товары для дома': cat6,
  'Товары для кухни': cat7,
  'Электробытовая техника для дома и кухни': cat8,
  'Изделия из пластика': cat9,
  'Скобяные изделия': cat10,
  Сантехника: cat11,
  'Товары для строительства и ремонта': cat12,
  'Кабельная продукция': cat13,
  'Электроустановочные изделия': cat14,
  Электротовары: cat15,
  'Спорт отдых туризм': cat16,
  'Детские товары': cat17,
  'Товары для бани': cat18,
  'Товары для животных': cat19,
  'Автохимия и авто товары': cat20,
  'Бытовая химия': cat21,
  'Сувенирная продукция': cat22,
  Пиротехника: cat23,
  'Новогодние товары': cat24,
  Прочее: cat25,
  'Стеллажи металлические': cat26,
}

export default observer(function TypeCard() {
  const { product } = useContext(Context)
  const history = useNavigate()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto', // for smoothly scrolling
    })
  }

  return (
    <div>
      {product.types ? (
        <div className="wrapTypeCard">
          {product.types.map((type, index) => (
            <div
              key={index}
              className="typeCard"
              onClick={() => {
                product.setSelectedType(type)
                history(SHOP_ROUTE + '/' + type.id)
                scrollToTop()
              }}
            >
              <Image
                className="typeImg"
                alt={type.name}
                src={typeImages[type.name]}
                style={{ objectFit: 'contain', pointerEvents: 'none' }}
              ></Image>
              <p className="typeCardName">{type.name}</p>
            </div>
          ))}
        </div>
      ) : (
        ''
      )}
    </div>
  )
})
