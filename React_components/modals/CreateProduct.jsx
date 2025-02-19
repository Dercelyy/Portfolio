import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Button, Col, Dropdown, Form, Modal, Row } from 'react-bootstrap'
import { Context } from '../..'
import { createProducts, fetchProducts } from '../../http/productAPI'

export default observer(
  function CreateProduct({ show, onHide }) {
    const { product } = useContext(Context)

    const [article, setArticle] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [imgUrl, setImgUrl] = useState('')
    // const [file, setFile] = useState(null)
    const [info, setInfo] = useState([])

    const [error, setError] = useState('')

    const addInfo = () => {
      setInfo([...info, { title: '', description: '', number: Date.now() }])
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

    const addProduct = () => {
      const formData = new FormData()
      formData.append('article', article)
      formData.append('name', name)
      formData.append('price', `${price}`)
      // formData.append('img', file)
      formData.append('img', imgUrl)
      formData.append('typeId', product.selectedSubType.typeId)
      formData.append('subTypeId', product.selectedSubType.id)
      formData.append('info', JSON.stringify(info))
      createProducts(formData).then(data => {
        onHide()
        fetchProducts().then(data => { product.setProducts(data.rows) })
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

    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Добавить товар
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
                    required
                  >
                    {subType.name}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Form.Control
              value={article}
              onChange={e => setArticle(e.target.value)}
              className="mt-3"
              placeholder="Введите артикул товара"
              required
            />
            <Form.Control
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              className="mt-3"
              placeholder="Введите название товара"
              required
            />
            <Form.Control
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="mt-3"
              placeholder="Введите стоимость товара"
              type="number"
              min={0}
            />
            <Form.Control
              className="mt-3"
              // onChange={selectFile}
              value={imgUrl}
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
            {info.map(i =>
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
            )}
          </Form>
          <p style={{ color: 'red' }}>{error && `${error}`}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button
            variant="outline-success"
            onClick={addProduct}
            disabled={article === '' || name === '' || price === 0 || imgUrl === '' ? true : false}
          >Добавить</Button>
        </Modal.Footer>
      </Modal>
    )
  }
)