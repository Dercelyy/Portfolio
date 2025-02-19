import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Image, ListGroup } from 'react-bootstrap'
import { Context } from '..'
import { useMediaQuery } from 'react-responsive'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import '../scss/components/_typeBar.scss'
import { useLocation, useNavigate } from 'react-router-dom'

import cat1 from '../assets/typesIcon/1.svg'
import cat2 from '../assets/typesIcon/2.svg'
import cat3 from '../assets/typesIcon/3.svg'
import cat4 from '../assets/typesIcon/4.svg'
import cat5 from '../assets/typesIcon/5.svg'
import cat6 from '../assets/typesIcon/6.svg'
import cat7 from '../assets/typesIcon/7.svg'
import cat8 from '../assets/typesIcon/8.svg'
import cat9 from '../assets/typesIcon/9.svg'
import cat10 from '../assets/typesIcon/10.svg'
import cat11 from '../assets/typesIcon/11.svg'
import cat12 from '../assets/typesIcon/12.svg'
import cat13 from '../assets/typesIcon/13.svg'
import cat14 from '../assets/typesIcon/14.svg'
import cat15 from '../assets/typesIcon/15.svg'
import cat16 from '../assets/typesIcon/16.svg'
import cat17 from '../assets/typesIcon/17.svg'
import cat18 from '../assets/typesIcon/18.svg'
import cat19 from '../assets/typesIcon/19.svg'
import cat20 from '../assets/typesIcon/20.svg'
import cat21 from '../assets/typesIcon/21.svg'
import cat22 from '../assets/typesIcon/22.svg'
import cat23 from '../assets/typesIcon/23.svg'
import cat24 from '../assets/typesIcon/24.svg'
import cat25 from '../assets/typesIcon/25.svg'
import cat26 from '../assets/typesIcon/26.svg'
import { SHOP_ROUTE } from '../utils/consts'

const typeIcons = {
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

export default observer(function TypeBar() {
  const { product } = useContext(Context)
  const [category, setCategory] = React.useState('')
  const history = useNavigate()

  const location = useLocation()

  const handleChange = event => {
    product.setSelectedType(event.target.value)
    setCategory(event.target.value)
    product.setTempPage(1)
    product.setSelectedSubType({})
    product.setSearchString('')
    product.setLimit(18)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }

  const isSmallScreen = useMediaQuery({ query: '(max-width: 991px' })
  const isScreenIphone = window.matchMedia('(max-width: 991px)')

  return (
    <div>
      {isSmallScreen || isScreenIphone.matches ? (
        product.types ? (
          <div style={{ textAlign: 'center' }}>
            <FormControl sx={{ m: 1, minWidth: 130 }}>
              <InputLabel id="simple-select-label">Категория</InputLabel>
              <Select
                labelId="simple-select-label"
                id="simple-select"
                value={category}
                label="Категория"
                onChange={handleChange}
                autoWidth
                style={{ fontSize: '14px' }}
              >
                {product.types.map(type => (
                  <MenuItem key={type.id} value={type} style={{ fontSize: '14px' }}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ) : (
          ''
        )
      ) : (
        <ListGroup>
          {product.types.map((type, index) => (
            <ListGroup.Item
              style={{ cursor: 'pointer' }}
              active={type.id === product.selectedType.id}
              onClick={() => {
                product.setSelectedType(type)
                product.setTempPage(1)
                product.setLimit(18)
                product.setSelectedSubType({})
                product.setSearchString('')
                history(SHOP_ROUTE + '/' + type.id)
                scrollToTop()
              }}
              key={type.id}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'left' }}>
                <Image
                  alt={type.name}
                  className={product.selectedType.name === type.name && 'typeIcon'}
                  width={35}
                  height={35}
                  src={typeIcons[type.name]}
                  style={{ objectFit: 'contain', pointerEvents: 'none' }}
                ></Image>
                {type.name}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
})
