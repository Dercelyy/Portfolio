import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Button, Form, Modal, Dropdown } from 'react-bootstrap'
import { Context } from '../..'
import { createSubTypes, fetchSubTypes } from '../../http/productAPI'

export default observer(
  function CreateSubType({ show, onHide }) {
    const [value, setValue] = useState('')
    const { product } = useContext(Context)
    const [error, setError] = useState('')

    const addSubType = () => {
      createSubTypes({ typeId: product.selectedType.id, name: value }).then(data => {
        setValue('')
        fetchSubTypes().then(data => product.setSubTypes(data))
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
            Добавить подкатегорию товара
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Dropdown className='mt-2 mb-2'>
              <Dropdown.Toggle>{product.selectedType.name || "Выберите тип"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {product.types.map(type =>
                  <Dropdown.Item
                    onClick={() => product.setSelectedType(type)}
                    key={type.id}
                    required
                  >
                    {type.name}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Form.Control
              value={value}
              onChange={(e) => { setValue(e.target.value); setError('') }}
              placeholder={"Ввведите название подкатегории товара"}
              required
            />
          </Form>
          <p style={{ color: 'red' }}>{error && `${error}`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button variant="outline-success" onClick={addSubType} disabled={value === '' ? true : false}>Добавить</Button>
        </Modal.Footer>
      </Modal>
    )
  }
)
