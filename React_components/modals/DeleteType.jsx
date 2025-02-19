import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Button, Form, Modal, Dropdown } from 'react-bootstrap'
import { Context } from '../..'
import { deleteTypes, fetchTypes } from '../../http/productAPI'

export default observer(
  function DeleteType({ show, onHide }) {
    // eslint-disable-next-line
    const [value, setValue] = useState('')
    const { product } = useContext(Context)

    const deleteType = () => {
      deleteTypes({ id: product.selectedType.id }).then(data => {
        setValue('')
        fetchTypes().then(data => product.setTypes(data))
        onHide()
      })
      product.setSelectedType({})
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
            Удалить категорию товара
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Dropdown className='mt-2 mb-2'>
              <Dropdown.Toggle>{product.selectedType.name || "Выберите категорию"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {product.types.map(type =>
                  <Dropdown.Item
                    onClick={() => product.setSelectedType(type)}
                    key={type.id}
                  >
                    {type.name}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button variant="outline-success" onClick={deleteType}>Удалить</Button>
        </Modal.Footer>
      </Modal>
    )
  }
)
