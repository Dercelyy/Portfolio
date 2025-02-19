import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Context } from '../..'
import { createTypes, fetchTypes } from '../../http/productAPI'

export default function CreateType({ show, onHide }) {
  const [value, setValue] = useState('')
  const { product } = useContext(Context)
  const [error, setError] = useState('')

  const addType = () => {
    createTypes({ name: value }).then(data => {
      setValue('')
      fetchTypes().then(data => product.setTypes(data))
      onHide()
    }).catch(err => {
      if (err.response) {
        setError(err.response.data.message)
      } else if (err.request) {
        // client never received a response, or request never left 
      } else {
        // anything else 
      }
    })
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить категорию товара
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={value}
            onChange={(e) => { setValue(e.target.value); setError('') }}
            placeholder={"Ввведите название категории товара"}
          />
        </Form>
        <p style={{ color: 'red' }}>{error && `${error}`}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
        <Button variant="outline-success" onClick={addType} disabled={value === '' ? true : false}>Добавить</Button>
      </Modal.Footer>
    </Modal>
  )
}
