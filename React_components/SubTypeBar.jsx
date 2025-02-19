import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Card, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from 'react-responsive'
import "swiper/swiper.min.css";
import '../scss/components/_subTypeBar.scss'
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../utils/consts';

const SubTypeBar = observer(() => {
    const { product } = useContext(Context)
    const history = useNavigate()

    const isSmallScreen = useMediaQuery({ query: '(max-width: 991px' })
    const isScreenIphone = window.matchMedia("(max-width: 991px)")

    return (
        <div>
            {isSmallScreen || isScreenIphone.matches
                ?
                product.selectedType.id
                    ?
                    <ol className='subTypeBarMobile'>
                        {product.subTypes.map((subType) =>
                            subType.typeId === product.selectedType.id ?
                                <li
                                    key={subType.id}
                                    className='item_SubTypeBarMobile'
                                    onClick={() => {
                                        product.setSelectedSubType(subType);
                                        product.setTempPage(1)
                                        product.setSearchString("");
                                        product.setLimit(18);
                                        history(SHOP_ROUTE + '/' + product.selectedType.id + '/' + subType.id);
                                    }}
                                >{subType.name}</li>
                                : ''
                        )}
                    </ol>
                    : ''
                :
                <Row>
                    <ol className='subTypeBar'>
                        {product.subTypes.map(subType =>
                            subType.typeId === product.selectedType.id ?
                                <li
                                    key={subType.id}
                                    className={subType.id === product.selectedSubType.id ? "subTypeBarItem active" : "subTypeBarItem"}
                                    onClick={() => {
                                        product.setSelectedSubType(subType);
                                        product.setTempPage(1);
                                        product.setSearchString("");
                                        product.setLimit(18);
                                        history(SHOP_ROUTE + '/' + product.selectedType.id + '/' + subType.id)
                                    }}
                                >
                                    {subType.name}
                                </li>
                                : ''
                        )}
                    </ol>
                </Row>
            }
        </div >

    );
});

export default SubTypeBar;