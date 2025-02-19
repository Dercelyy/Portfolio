import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Row } from 'react-bootstrap'
import ProductItem from './ProductItem'
import { Context } from '..'

export default observer(
  function ProductList() {
    const { product } = useContext(Context)

    return (
      <Row style={{ gap: "10px", marginBottom: "15px", justifyContent: "space-around" }}>
        {product.products.map(productItem =>
          <ProductItem key={productItem.id} device={productItem} categories={product.types} />
        )}
      </Row>
    )
  }
) 