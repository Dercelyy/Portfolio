import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Dropdown, Form, Modal, Row } from 'react-bootstrap'
import { Context } from '../..'
import { editOneProduct, fetchProducts } from '../../http/productAPI'

import { v4 } from 'uuid'

export default observer(
  function CreateProduct({ show, onHide, device }) {
    const { product } = useContext(Context)

    const [article, setArticle] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [imgUrl, setImgUrl] = useState('')
    // const [file, setFile] = useState(null)
    const [info, setInfo] = useState([])

    const [error, setError] = useState('')

    const addInfo = () => {
      setInfo([...info, { title: '', description: '', number: v4() }])
    }
    const removeInfo = (number) => {
      setInfo(info.filter(i => i.number !== number))
    }
    const changeInfo = (key, value, number) => {
      setInfo(info.map(i => i.number === number ? { ...i, [key]: value } : i))
    }

    // const selectFile = e => {
    //   setFile(e.target.files[0])
    // }

    const editProduct = () => {
      const formData = new FormData()
      formData.append('article', article)
      formData.append('name', name)
      formData.append('price', `${price}`)
      // formData.append('img', file)
      formData.append('img', imgUrl)
      formData.append('info', JSON.stringify(info))
      editOneProduct(formData).then(data => {
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

    const verifyUrl = (url) => {
      let newUrl
      if (url.includes("drive.google")) {
        newUrl = "https://drive.google.com/uc?export=view&id=" + url.substring(
          url.indexOf("/d/") + 3,
          url.lastIndexOf("/view")
        )
      } else {
        newUrl = url
      }
      setImgUrl(newUrl)
    }

    useEffect(() => {
      setArticle(device.article)
      setName(device.name)
      setPrice(Number(device.price))
      setImgUrl(device.img)
      device.info.forEach((inf, index, thisArray) => {
        thisArray[index].number = v4()
      })
      setInfo(device.info)
    }, [show])

    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Редактирование товара
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              value={name || ''}
              onChange={e => { setName(e.target.value); setError('') }}
              className="mt-3"
              placeholder="Введите название товара"
              required
            />
            <Form.Control
              value={price || 0}
              onChange={e => setPrice(Number(e.target.value))}
              className="mt-3"
              placeholder="Введите стоимость товара"
              type="number"
              min={0}
            />
            <Form.Control
              className="mt-3"
              // onChange={selectFile}
              value={imgUrl || ''}
              placeholder="Вставьте ссылку на изображение"
              onChange={e => { verifyUrl(e.target.value); setError('') }}
              required
            />
            <hr />
            <Button
              variant={"outline-dark"}
              onClick={addInfo}
            >
              Добавить новое свойство
            </Button>
            {info.length > 0 ? info.map(i =>
              <Row className="mt-4" key={i.number}>
                <Col md={4}>
                  <Form.Control
                    value={i.title}
                    onChange={(e) => changeInfo('title', e.target.value, i.number)}
                    placeholder="Введите название свойства"
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    value={i.description}
                    onChange={(e) => changeInfo('description', e.target.value, i.number)}
                    placeholder="Введите описание свойства"
                    required
                  />
                </Col>
                <Col md={4}>
                  <Button
                    variant={'outline-danger'}
                    onClick={() => removeInfo(i.number)}
                  >
                    Удалить
                  </Button>
                </Col>
              </Row>
            ) : ''}
          </Form>
          <p style={{ color: 'red' }}>{error && `${error}`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button
            variant="outline-success"
            onClick={editProduct}
            disabled={name === '' || price === 0 || imgUrl === '' ? true : false}
          >Изменить</Button>
        </Modal.Footer>
      </Modal>
    )
  }
)