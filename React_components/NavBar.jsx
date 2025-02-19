import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Container, Button, Col, Row, Form } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Context } from '..'
import {
  ABOUT_ROUTE,
  ADMIN_ROUTE,
  BASKET_ROUTE,
  CONTACTS_ROUTE,
  DELIVERY_ROUTE,
  LOGIN_ROUTE,
  ORDER_PAYMENT_ROUTE,
  SERVICE_ROUTE,
  SHOP_ROUTE,
  VACANCIES_ROUTE,
} from '../utils/consts'
import logo from '../assets/logo.svg'
import { useMediaQuery } from 'react-responsive'

import '../scss/components/_header.scss'
import SearchIcon from '@mui/icons-material/Search'
import { CSSTransition } from 'react-transition-group'

const StyledMenu = styled.nav`
  position: absolute;
  top: 64px;
  left: 0;
  height: auto;
  width: 35vw;
  pisition: fixed;
  background-color: #ff781f;
  z-index: 2;

  display: flex;
  flex-direction: column;
  padding: 10px 0;

  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  @media (max-width: 600px) {
    width: 100%;
  }
`

const StyledHamburger = styled.button`
  left: 3vw;
  top: 3vw;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: transparent;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border: none;
  cursor: pointer;
  outline: none;
  z-index: 1;
  div {
    position: relative;
    width: 2rem;
    height: 0.25rem;
    border-radius: 10px;
    background-color: ${({ open }) => (open ? '#FF781F' : '#FF781F')};

    transition: all 0.3s linear;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }
    :nth-child(2) {
      opacity: ${({ open }) => (open ? '0' : '1')};
      transform: ${({ open }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }
    :nth-child(3) {
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`

export default observer(function NavBar() {
  const { user } = useContext(Context)
  const { product } = useContext(Context)
  const [showSearch, setShowSearch] = useState(false)
  const [showBurger, setShowBurger] = useState(false)

  const [searchStr, setSearchStr] = useState('')

  const history = useNavigate()
  const wrapperRef = useRef(null)
  const burgerRef = useRef(null)

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target) && !burgerRef.current.contains(event.target)) {
          setShowBurger(false)
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }

  useOutsideAlerter(wrapperRef)

  const location = useLocation()
  const isShop = location.pathname.indexOf(SHOP_ROUTE) > -1 || location.pathname === '/'

  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false)
  }

  const isSmallScreen = useMediaQuery({ query: '(max-width: 991px' })
  const isScreenIphone = window.matchMedia('(max-width: 991px)')

  const checkRole = () => {
    return user.user['role'] === 'ADMIN' || user.user['role'] === 'CREATOR'
  }

  return (
    <div>
      {isSmallScreen || isScreenIphone.matches ? (
        <div>
          <div className="mobileHeader">
            <StyledHamburger open={showBurger} onClick={() => setShowBurger(!showBurger)} ref={burgerRef}>
              <div />
              <div />
              <div />
            </StyledHamburger>
            <div className="logo_mobileHeader">
              <img
                src={logo}
                alt="Хозоптсклад. Самые низкие цены."
                onClick={() => {
                  product.setSelectedType('')
                  product.setSelectedSubType({})
                  product.setSearchString('')
                  setShowBurger(false)
                  history(SHOP_ROUTE)
                }}
              />
            </div>
            <CSSTransition in={showSearch} classNames="alert" timeout={300} unmountOnExit>
              <div className="searchWrap">
                <input
                  className="searchInput"
                  placeholder="Поиск..."
                  type="text"
                  value={searchStr}
                  onChange={e => setSearchStr(e.target.value)}
                ></input>
                <button
                  className="searchButton"
                  onClick={() => {
                    product.setSearchString(searchStr)
                    history(SHOP_ROUTE)
                    setShowBurger(false)
                    setSearchStr('')
                    setShowSearch(false)
                  }}
                >
                  Найти
                </button>
              </div>
            </CSSTransition>
            <SearchIcon
              onClick={() => setShowSearch(!showSearch)}
              style={{ width: '30px', height: '30px', color: '#FF781F', cursor: 'pointer' }}
            ></SearchIcon>
          </div>
          <StyledMenu open={showBurger} ref={wrapperRef}>
            <ul className="burgerList">
              <li
                className="item_burgerList"
                onClick={() => {
                  history(SHOP_ROUTE)
                  product.setSearchString('')
                  product.setSelectedType({})
                  product.setSelectedSubType({})
                  setShowBurger(false)
                }}
              >
                Главная
              </li>
              <li
                className="item_burgerList"
                onClick={() => {
                  history(ORDER_PAYMENT_ROUTE)
                  setShowBurger(false)
                }}
              >
                Заказ и оплата
              </li>
              <li
                className="item_burgerList"
                onClick={() => {
                  history(DELIVERY_ROUTE)
                  setShowBurger(false)
                }}
              >
                Доставка
              </li>
              <li
                className="item_burgerList"
                onClick={() => {
                  history(SERVICE_ROUTE)
                  setShowBurger(false)
                }}
              >
                Сервис
              </li>
              <li
                className="item_burgerList"
                onClick={() => {
                  history(ABOUT_ROUTE)
                  setShowBurger(false)
                }}
              >
                О компании
              </li>
              <li
                className="item_burgerList"
                onClick={() => {
                  history(VACANCIES_ROUTE)
                  setShowBurger(false)
                }}
              >
                Вакансии
              </li>
              <li
                className="item_burgerList"
                onClick={() => {
                  history(CONTACTS_ROUTE)
                  setShowBurger(false)
                }}
              >
                Контакты
              </li>
            </ul>
            {user.isAuth ? (
              <div className="buttonsMobile">
                <Button
                  variant="outline-dark"
                  onClick={() => {
                    logOut()
                    history(SHOP_ROUTE)
                    setShowBurger(false)
                  }}
                  className={'headerButton'}
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <div className="buttonsMobile">
                <Button
                  variant="outline-dark"
                  onClick={() => {
                    history(LOGIN_ROUTE)
                    setShowBurger(false)
                  }}
                  className={isSmallScreen ? '' : 'navbarButton'}
                >
                  Авторизация
                </Button>
              </div>
            )}
          </StyledMenu>
        </div>
      ) : (
        <div>
          <div className="header_top">
            <Container>
              <div className="wrapper">
                <div className="navBar_wrap">
                  <ul className="navList">
                    <li
                      className="item_navList"
                      onClick={() => {
                        history(SHOP_ROUTE)
                        product.setSearchString('')
                        product.setSelectedType({})
                        product.setSelectedSubType({})
                      }}
                    >
                      Главная
                    </li>
                    <li className="item_navList">
                      <Link to={ORDER_PAYMENT_ROUTE}>Заказ и оплата</Link>
                    </li>
                    <li className="item_navList">
                      <Link to={DELIVERY_ROUTE}>Доставка</Link>
                    </li>
                    <li className="item_navList">
                      <Link to={SERVICE_ROUTE}>Сервис</Link>
                    </li>
                    <li className="item_navList">
                      <Link to={ABOUT_ROUTE}>О компании</Link>
                    </li>
                    <li className="item_navList">
                      <Link to={VACANCIES_ROUTE}>Вакансии</Link>
                    </li>
                    <li className="item_navList">
                      <Link to={CONTACTS_ROUTE}>Контакты</Link>
                    </li>
                  </ul>
                </div>
                <div className="wrap_buttons">
                  {user.isAuth ? (
                    <div className="wrap_buttons">
                      {checkRole() ? (
                        <Button variant="outline-light" onClick={() => history(ADMIN_ROUTE)} className={'headerButton'}>
                          Админ панель
                        </Button>
                      ) : (
                        ''
                      )}
                      <Button
                        variant="outline-light"
                        onClick={() => {
                          logOut()
                          history(SHOP_ROUTE)
                        }}
                        className={'headerButton'}
                      >
                        Выйти
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        variant="outline-light"
                        onClick={() => history(LOGIN_ROUTE)}
                        className={isSmallScreen ? '' : 'navbarButton'}
                      >
                        Авторизация
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="outline-light"
                    onClick={() => {
                      history(BASKET_ROUTE)
                    }}
                    className={'headerButton me-5'}
                  >
                    Корзина
                  </Button>
                </div>
              </div>
            </Container>
          </div>
          <div className="header_bot">
            <Container>
              <Row className="header_bot__row">
                <Col md={4}>
                  <div className="header_logo">
                    <img
                      src={logo}
                      alt=""
                      onClick={() => {
                        history(SHOP_ROUTE)
                        product.setSearchString('')
                        product.setSelectedType({})
                        product.setSelectedSubType({})
                      }}
                    />
                  </div>
                </Col>
                <Col className="findBlock_wrap" md={8}>
                  {isShop ? (
                    <Form className="d-flex">
                      <Form.Control
                        type="search"
                        placeholder="Поиск..."
                        className="findInput"
                        aria-label="Search"
                        value={searchStr}
                        onChange={e => setSearchStr(e.target.value)}
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            product.setSearchString(searchStr)
                            product.setSelectedType('')
                            product.setSelectedSubType({})
                            setSearchStr('')
                          }
                        }}
                      />
                      <Button
                        variant="outline-dark"
                        className="me-5 findBtn"
                        onClick={() => {
                          product.setSearchString(searchStr)
                          product.setSelectedType('')
                          product.setSelectedSubType({})
                          setSearchStr('')
                        }}
                      >
                        Найти
                      </Button>
                    </Form>
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      )}
    </div>
  )
})
