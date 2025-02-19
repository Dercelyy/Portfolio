import { Container, Pagination } from '@mui/material';
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { useEffect } from 'react';
// import {Pagination} from 'react-bootstrap';
import { Context } from '..';

export default observer(
  function Pages() {
    const { product } = useContext(Context)
    const pageCount = Math.ceil(product.totalCount / product.limit)
    const pages = []
    for (let i = 0; i < pageCount; i++) {
      pages.push(i + 1)
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // for smoothly scrolling
      });
    };

    useEffect(() => {
      if (product.tempPage !== product.page) {
        product.setPage(product.tempPage)
      }
    }, [product.page])

    return (
      <Container>
        <Pagination
          className='my-5'
          count={pageCount}
          page={product.page}
          onChange={(_, num) => { product.setPage(num); product.setTempPage(num); scrollToTop() }}
          color="primary"
        ></Pagination>
      </Container>
    )
  }
) 
