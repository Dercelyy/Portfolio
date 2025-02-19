import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Button, Form, Modal, Dropdown } from 'react-bootstrap'
import { Context } from '../..'
import { deleteSubTypes, fetchSubTypes } from '../../http/productAPI'

export default observer(
  function DeleteSubType({ show, onHide }) {
    // eslint-disable-next-line
    const [value, setValue] = useState('')
    const { product } = useContext(Context)

    const deleteSubType = () => {
      deleteSubTypes({ id: product.selectedSubType.id }).then(data => {
        setValue('')
        fetchSubTypes().then(data => product.setSubTypes(data))
        onHide()
      })
      product.setSelectedSubType({})
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
            Удалить подкатегорию товара
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Dropdown className='mt-2 mb-2'>
              <Dropdown.Toggle>{product.selectedSubType.name || "Выберите подкатегорию"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {product.subTypes.map(subType =>
                  <Dropdown.Item
                    onClick={() => product.setSelectedSubType(subType)}
                    key={subType.id}
                  >
                    {subType.name}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button variant="outline-success" onClick={deleteSubType}>Удалить</Button>
        </Modal.Footer>
      </Modal>
    )
  }
)
