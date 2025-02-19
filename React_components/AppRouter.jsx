import React, { useContext } from 'react'
import { Routes, Route } from "react-router-dom"
import { Context } from '..'
import Shop from '../pages/Shop'
import { authRoutes, publicRoutes } from '../routes'
import { observer } from "mobx-react-lite";

import '../scss/components/_appRouter.scss'

export default observer(
  function AppRouter() {
    const { user } = useContext(Context)

    return (
      <div className='appRouter' style={{ position: "relative" }}>
        <Routes>
          {user.isAuth && authRoutes.map(({ path, Component }) =>
            <Route key={path} path={path} element={<Component />} exact />
          )}
          {publicRoutes.map(({ path, Component }) =>
            <Route key={path} path={path} element={<Component />} exact />
          )}
          <Route path="*" element={<Shop />} />
        </Routes>
      </div>
    )
  }
)