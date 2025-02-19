import { Container, Pagination } from '@mui/material';
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
// import {Pagination} from 'react-bootstrap';
import { Context } from '..';

import '../scss/components/_upLimit.scss'

export default observer(
    function UpLimitProduct() {
        const { product } = useContext(Context)
        let startLimit = product.limit

        const editLimit = () => {

            if ((product.totalCount - startLimit) < 6) {
                product.setLimit(product.limit + (product.totalCount - startLimit))
            } else {
                product.setLimit(product.limit + 9)
            }
        }

        return (
            <Container>
                <button
                    className='upLimitBtn'
                    disabled={product.totalCount <= startLimit}
                    onClick={() => { editLimit() }}
                >Показать ещё</button>
            </Container>
        )
    }
)