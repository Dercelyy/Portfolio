import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Context } from '../..'
import { deleteAllBasketProduct, sendBasketProduct } from '../../http/basketAPI'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

import SuccessEmail from './MessageModal'

export default function SendOrder({ show, onHide }) {
  const [delivery, setDelivery] = React.useState('Самовывоз')
  const [pay, setPay] = React.useState('Наличными')

  const [name, setName] = useState('')
  const [phoneNum, setPhoneNum] = useState('')
  const [adressDelivery, setAdressDelivery] = useState('')
  const [comment, setComment] = useState('')

  const { product } = useContext(Context)
  const { user } = useContext(Context)
  const [error, setError] = useState('')

  const [numOrder, setNumOrder] = useState('')

  const [successSend, setSuccessSend] = useState(false)

  const deliveryChange = event => {
    setDelivery(event.target.value)
  }
  const payChange = event => {
    setPay(event.target.value)
  }

  const handleEditNumber = e => {
    const myPatternNumber = /^((\+7|7|8)+([0-9]){10})$/
    myPatternNumber.test(e.target.value) ? setPhoneNum(e.target.value) : setError('Некорректный номер')
  }

  const sendEmail = cart => {
    let cartProduct
    if (user.isAuth) {
      if (delivery === 'Самовывоз') {
        cartProduct = [user.user, { name: name, contact: phoneNum, delivery: delivery, pay: pay, comment: comment }]
      } else if (delivery === 'Доставка') {
        cartProduct = [
          user.user,
          {
            name: name,
            contact: phoneNum,
            delivery: delivery,
            adressDelivery: adressDelivery,
            pay: pay,
            comment: comment,
          },
        ]
      }
    } else {
      if (delivery === 'Самовывоз') {
        cartProduct = [{ name: name, contact: phoneNum, delivery: delivery, pay: pay, comment: comment }]
      } else if (delivery === 'Доставка') {
        cartProduct = [
          {
            name: name,
            contact: phoneNum,
            delivery: delivery,
            adressDelivery: adressDelivery,
            pay: pay,
            comment: comment,
          },
        ]
      }
    }

    cart.forEach(item => {
      cartProduct.push({ article: item.article, name: item.name, cost: item.cost, count: item.count })
    })
    if (!error) {
      sendBasketProduct(cartProduct).then(data1 => {
        onHide()
        product.setBasket([])
        setNumOrder(data1)
        if (user.isAuth) {
          deleteAllBasketProduct(user.user.id).then(data2 => {})
        } else {
          localStorage.removeItem('cart')
        }
        setSuccessSend(true)
      })
    }
  }

  return (
    <div>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Оформление заказа:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-2"
              value={name}
              onChange={e => {
                setName(e.target.value)
                setError('')
              }}
              placeholder={'Ввведите ваше Имя'}
              type="text"
            />
            <Form.Control
              className="mb-2"
              value={phoneNum}
              onChange={e => {
                setPhoneNum(e.target.value)
                setError('')
              }}
              placeholder={'Ввведите номер телефона'}
              type="tel"
              onBlur={handleEditNumber}
            />
          </Form>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Способ доставки</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={delivery}
              onChange={deliveryChange}
            >
              <FormControlLabel value="Самовывоз" control={<Radio />} label="Самовывоз c Караульная 5а стр. 2" />
              <FormControlLabel value="Доставка" control={<Radio />} label="Доставка" />
            </RadioGroup>
          </FormControl>
          {delivery === 'Доставка' ? (
            <Form.Control
              className="mb-2"
              value={adressDelivery}
              onChange={e => {
                setAdressDelivery(e.target.value)
                setError('')
              }}
              placeholder={'Ввведите адрес доставки'}
            />
          ) : (
            ''
          )}
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Способ оплаты</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={pay}
              onChange={payChange}
            >
              <FormControlLabel value="Наличными" control={<Radio />} label="Наличными" />
              <FormControlLabel value="Онлайн перевод" control={<Radio />} label="Онлайн перевод" />
            </RadioGroup>
          </FormControl>
          <Form.Control
            className="mb-2"
            value={comment}
            onChange={e => {
              setComment(e.target.value)
              setError('')
            }}
            placeholder={'Ввведите комментарий'}
          />
          <p style={{ color: 'red' }}>{error && `${error}`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Закрыть
          </Button>
          <Button
            variant="outline-success"
            onClick={() => sendEmail(product.basket)}
            disabled={
              (delivery === 'Доставка' ? adressDelivery === '' : false) || phoneNum === '' || name === '' ? true : false
            }
          >
            Отправить
          </Button>
        </Modal.Footer>
      </Modal>

      <SuccessEmail
        show={successSend}
        onHide={() => setSuccessSend(false)}
        messageText={`Ваш заказ успешно отправлен на обработку! Ваш номер заказа: ${numOrder}`}
      />
    </div>
  )
}
