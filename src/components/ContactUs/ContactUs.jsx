import React from 'react'
import style from './ContactUs.module.css'
import Form from './Form'

const ContactUs = () => {
    return (
        <div className={style.contactUs} id='contactUs'>
            <h1>Contact Me</h1>
            <p>Questions, Thoughts, Or Just Want To Say Hello?</p>
            <Form/>
        </div>
    )
}

export default ContactUs