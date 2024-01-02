import React from 'react'
import style from './ContactUs.module.css'
import { FaCheckCircle } from 'react-icons/fa'

const Thanks = () => {
  return (
    <div className={style.thanks}>

        <FaCheckCircle/>

        <h1>Thank you for contact us</h1>

        <h3>Your Information is successfully submitted.</h3>

        <p>I will contact you on provided email address within 12 hours.</p>

    </div>
  )
}

export default Thanks