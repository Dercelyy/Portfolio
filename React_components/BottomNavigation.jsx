import React, { useContext, useEffect } from 'react'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { ADMIN_ROUTE, BASKET_ROUTE, SHOP_ROUTE } from '../utils/consts'
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';

import '../scss/components/_bottomNavigation.scss'
import { Context } from '..';

export default observer(
  function BottomNavbar() {
    const [value, setValue] = React.useState(0);
    const { user } = useContext(Context)
    const { product } = useContext(Context)
    const history = useNavigate()

    const location = useLocation()
    const isShop = location.pathname === SHOP_ROUTE || location.pathname === "/"

    useEffect(() => {
      if (location.pathname === SHOP_ROUTE || location.pathname === "/") {
        setValue(0);
      } else if (location.pathname === BASKET_ROUTE) {
        setValue(1);
      } else if (location.pathname === ADMIN_ROUTE) {
        setValue(2);
      } else {
        setValue('')
      }
    }, [location.pathname])

    return (
      <BottomNavigation
        className='bottomNavigation'
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          className='bottomNavigationAction'
          label="Главная"
          icon={<HomeIcon />}
          onClick={() => {
            history(SHOP_ROUTE);
            product.setSearchString("");
            product.setSelectedType({});
            product.setSelectedSubType({});
          }} />
        <BottomNavigationAction
          className='bottomNavigationAction'
          label="Корзина" icon={<ShoppingCartIcon />}
          onClick={() => { history(BASKET_ROUTE) }} />
        {(user.user.role === "ADMIN" || user.user.role === "CREATOR") &&
          <BottomNavigationAction
            className='bottomNavigationAction'
            label="Профиль" icon={<AccountCircleIcon />}
            onClick={() => history(ADMIN_ROUTE)} />
        }
      </BottomNavigation>
    )
  }
)

