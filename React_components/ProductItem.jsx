import { useSnackbar } from 'notistack'
import React, { useContext, useState } from 'react'
import { Card, Image } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import productCart from '../assets/productCart.svg'
import { PRODUCT_ROUTE } from '../utils/consts'

import { Context } from '..'
import { createBasket } from '../http/basketAPI'
import '../scss/components/_productItem.scss'

import { wrappingCost } from '../components/functions/secondaryFunctions'

export default function ProductItem({ device, categories }) {
	const history = useNavigate()
	const { product } = useContext(Context)
	const { user } = useContext(Context)
	const [disabledBtn, setDisabledBtn] = useState(false)

	const { enqueueSnackbar } = useSnackbar()

	const addProductCard = () => {
		if (user.isAuth) {
			if (!disabledBtn) {
				setDisabledBtn(true)
				createBasket({
					userId: user.user['id'],
					productId: device.id,
					cost: Math.round(wrappingCost(device.price, 1, user.user.opt)),
				}).then(data => {
					let i = 0
					for (let item of data[0]) {
						Object.assign(item, {
							idRow: data[1][i]['id'],
							count: data[1][i]['count'],
							cost: data[1][i]['cost'],
						})
						i += 1
					}
					product.setBasket(data[0])
					setDisabledBtn(false)
				})
			} else {
				addProductCard()
			}
		} else {
			let basket = []
			let find = false

			if (localStorage.getItem('cart') !== null) {
				basket = JSON.parse(localStorage.getItem('cart'))
				for (let i = 0; i < basket.length; i++) {
					if (basket[i].id === device.id) {
						basket[i].cost = Math.round(
							(basket[i].cost / basket[i].count) *
								(Number(basket[i].count) + Number(1))
						)
						basket[i].count += 1
						find = true
						break
					}
				}
				if (!find) {
					basket.push({
						id: device.id,
						article: device.article,
						img: device.img,
						name: device.name,
						cost: Math.round(wrappingCost(device.price, 1, user.user.opt)),
						count: 1,
					})
				}
			} else {
				basket.push({
					id: device.id,
					article: device.article,
					img: device.img,
					name: device.name,
					cost: Math.round(wrappingCost(device.price, 1, user.user.opt)),
					count: 1,
				})
			}
			localStorage.cart = JSON.stringify(basket)
		}
	}

	// 'https://хозоптсклад.рф/images/' + editImgUrl(device.img)
	// ? '//images.weserv.nl?url=' + device.img
	const editImgUrl = url => {
		return url.substring(url.lastIndexOf('/') + 1)
	}

	const handleClickVariant = variant => {
		// variant could be success, error, warning, info, or default
		enqueueSnackbar('Товар успешно добавлен в корзину!', { variant })
	}

	const handleClickOutside = e => {
		e.stopPropagation()
		addProductCard()
		handleClickVariant('success')
	}
	return (
		<Card className='productItem' border={'light'}>
			<Link to={PRODUCT_ROUTE + '/' + device.id}>
				{device.img && !device.img.includes('NONE') ? (
					<Image
						className='productImg'
						alt={device.name}
						src={
							device.img.includes('hozkomplekt')
								? 'https://хозоптсклад.рф/images/' + editImgUrl(device.img)
								: device.img
						}
						onError={({ currentTarget }) => {
							currentTarget.onerror = null
							currentTarget.src = '//images.weserv.nl?url=' + device.img
						}}
					/>
				) : (
					<Card
						className='d-flex flex-column align-items-center justify-content-around productImg'
						style={{ width: 150, height: 150, border: '5px solid lightgray' }}
					>
						<h4 style={{ textAlign: 'center' }}>Фото не загружено</h4>
					</Card>
				)}
				<div className='mt-1 align-items-center'>
					<div
						className='productName'
						style={{ fontSize: '14px', wordBreak: 'break-word' }}
					>
						{device.name}
					</div>
					{device.availability ? (
						<div className='productAvail' style={{ color: '#8ac926' }}>
							Есть в наличии
						</div>
					) : (
						<div className='productAvail' style={{ color: '#e71d36' }}>
							Нет в наличии
						</div>
					)}
					<div
						className='d-flex align-items-center'
						style={{
							justifyContent: 'space-between',
							gap: '10px',
							flexWrap: 'wrap',
						}}
					>
						<div className='productPrice'>
							{Math.round(wrappingCost(device.price, 1, user.user.opt))} руб.
						</div>
						<div
							className='circleCard'
							onClick={e => {
								e.preventDefault()
								handleClickOutside(e)
							}}
						>
							<Image alt='card' className='imageCard' src={productCart}></Image>
						</div>
					</div>
				</div>
			</Link>
		</Card>
	)
}
