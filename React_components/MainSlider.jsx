import React, { useRef, useState } from 'react'
// Import Swiper React components

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import slide1 from '../assets/mainSlider/concreteMixer.webp'
import slide2 from '../assets/mainSlider/pools.webp'
import slide3 from '../assets/mainSlider/powerTools.webp'
import slide4 from '../assets/mainSlider/powerTools2.webp'
import slide5 from '../assets/mainSlider/showerTanks.webp'
import slide6 from '../assets/mainSlider/tanPlust.webp'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import '../scss/components/_mainSlider.scss'

export default function MainSlider() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img alt="Бетономешалки Helmut" src={slide1}></img>
        </SwiperSlide>
        <SwiperSlide>
          <img alt="Бассейны купели" src={slide2}></img>
        </SwiperSlide>
        <SwiperSlide>
          <img alt="Электроинструменты" src={slide3}></img>
        </SwiperSlide>
        <SwiperSlide>
          <img alt="Электроинструменты" src={slide4}></img>
        </SwiperSlide>
        <SwiperSlide>
          <img alt="Улучшенные душевые баки" src={slide5}></img>
        </SwiperSlide>
        <SwiperSlide>
          <img alt="Пластиковые баки" src={slide6}></img>
        </SwiperSlide>
      </Swiper>
    </>
  )
}
