import React from 'react'
import { useState, useContext } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Context } from '../..'
import { createPrice, fetchProducts, } from '../../http/productAPI'
import { Spinner } from "react-bootstrap";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function CreatePrice({ show, onHide }) {
  const { product } = useContext(Context)
  const [file, setFile] = useState(null)

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const selectFile = e => {
    setFile(e.target.files[0])
  }

  const addPrice = () => {
    handleToggle()
    const formData = new FormData()
    formData.append('excel', file)
    createPrice(formData).then(data => {
      fetchProducts().then(data => {
        product.setProducts(data.rows);
        onHide();
        handleClose()
      })
    }).catch(error => {
      console.log(error);
      handleClose();
    })
  }

  if (loading) {
    return <Spinner style={{ position: "absolute", left: "50%", top: "50%" }} animation={
      "grow"
    }
    />
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
          Отправить прайс-лист
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            type="file"
            onChange={selectFile}
            required
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" disabled={loading} onClick={onHide}>Закрыть</Button>
        <Button variant="outline-success" disabled={loading} onClick={addPrice}>Отправить</Button>
      </Modal.Footer>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Modal>
  )
}
