import { observer } from 'mobx-react-lite'
import React, { Component, useCallback, useContext, useEffect, useState } from 'react'
import Select from "react-select";
import { Button, Form, Modal, Dropdown } from 'react-bootstrap'
import { Context } from '../..'
import { deleteProducts, fetchProducts } from '../../http/productAPI'

import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import "../../scss/components/_deleteProduct.scss"
import { Box } from '@mui/material';

import { v4 } from 'uuid'

export default observer(
  function DeleteProduct({ show, onHide }) {
    const [value, setValue] = useState({})
    const { product } = useContext(Context)

    const [input, setInput] = useState('')

    let productList = []

    const [selectList, setSelectList] = useState([])

    const filterOptions = createFilterOptions({
      matchFrom: 'any',
      limit: 500,
    });

    const deleteProduct = () => {
      deleteProducts({ id: value }).then(data => {
        setValue('')
        onHide()
      })
      setValue({})
    }

    useEffect(() => {
      product.setProducts([])
    }, [onHide])

    useEffect(() => {
      if (product.selectedType.id || product.selectedSubType.id) {
        fetchProducts(product.selectedType.id, product.selectedSubType.id, null, null).then(data => {
          product.setProducts(data.rows)
          productList = []
          product.products.forEach((item) => {
            productList.push({ id: item.id, label: item.name })
          })
          setSelectList(productList)
        })
      }
      // eslint-disable-next-line
    }, [product.selectedType, product.selectedSubType])

    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Удалить товар
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Dropdown className='mt-2 mb-2'>
              <Dropdown.Toggle>{product.selectedType.name || "Выберите категорию"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {product.types.map(type =>
                  <Dropdown.Item
                    onClick={() => { product.setSelectedType(type); product.setSelectedSubType({}) }}
                    key={type.id}
                    required
                  >
                    {type.name}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            {product.subTypes.some(item => item.typeId === product.selectedType.id) &&
              <Dropdown className='btnSubType mt-2 mb-2'>
                <Dropdown.Toggle >{product.selectedSubType.name || "Выберите подкатегорию"}</Dropdown.Toggle>
                <Dropdown.Menu>
                  {product.subTypes.map(subType =>
                    subType.typeId === product.selectedType.id ?
                      <Dropdown.Item
                        onClick={() => { product.setSelectedSubType(subType); }}
                        key={subType.id}
                        required
                      >
                        {subType.name}
                      </Dropdown.Item>
                      : ''
                  )}
                </Dropdown.Menu>
              </Dropdown>
            }
            {product.selectedType.id &&
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={selectList}
                onChange={(e, val) => {
                  setValue(val.id);
                  setInput(val.label)
                }}
                isOptionEqualToValue={(option, value) => {
                  if (value.id) return option === value
                  return true
                }}
                getOptionLabel={(option) => !option ? '' : option.label}
                renderOption={(props, option) => {
                  return (
                    <Box
                      component="li" {...props}
                      key={v4()}
                    >
                      {option.label}
                    </Box>
                  );
                }}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Товары" autoComplete="false" />}
                filterOptions={filterOptions}
              />
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button variant="outline-success" onClick={deleteProduct}>Удалить</Button>
        </Modal.Footer>
      </Modal>
    )
  }
)