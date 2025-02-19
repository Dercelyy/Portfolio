import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function SuccessEmail({ show, onHide, messageText }) {

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Сообщение
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{messageText}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" onClick={onHide}>Ок</Button>
      </Modal.Footer>
    </Modal>
  )
}
