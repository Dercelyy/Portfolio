import React from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { ABOUT_ROUTE, CONTACTS_ROUTE, DELIVERY_ROUTE, ORDER_PAYMENT_ROUTE, SERVICE_ROUTE, SHOP_ROUTE, VACANCIES_ROUTE } from '../utils/consts'
import logo from '../assets/footer_logo.svg'

import '../scss/components/_footer.scss'
import { Container } from 'react-bootstrap'

export default observer(
    function Footer() {
        const history = useNavigate()

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // for smoothly scrolling
            });
        };

        return (
            <div className='wrapperFooter'>
                <Container>
                    <div className='footer'>
                        <div className='logo_footer'>
                            <img style={{ cursor: 'pointer' }} src={logo} onClick={() => { history(SHOP_ROUTE); scrollToTop() }} alt="" />
                        </div>
                        <div className='menu_footer'>
                            <p className='menu_item' onClick={() => { history(ORDER_PAYMENT_ROUTE); scrollToTop() }}>Заказ и оплата</p>
                            <p className='menu_item' onClick={() => { history(DELIVERY_ROUTE); scrollToTop() }}>Доставка</p>
                            <p className='menu_item' onClick={() => { history(SERVICE_ROUTE); scrollToTop() }}>Сервис</p>
                            <p className='menu_item' onClick={() => { history(ABOUT_ROUTE); scrollToTop() }}>О компании</p>
                            <p className='menu_item' onClick={() => { history(VACANCIES_ROUTE); scrollToTop() }}>Вакансии</p>
                            <p className='menu_item' onClick={() => { history(CONTACTS_ROUTE); scrollToTop() }}>Контакты</p>
                        </div>
                        <div className='wrapNumber'>
                            <p>8-967-612-07-22</p>
                            <p>8 (391) 272-07-22</p>
                        </div>
                        <div className='wrapAdress'>
                            <p>г. Красноярск, ул. Караульная 5а, стр. 2</p>
                            <p>Режим работы с 10:00 до 18:00</p>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
) 
