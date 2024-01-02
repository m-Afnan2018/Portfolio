import React from 'react'
import style from './ContactUs.module.css'
import {FaPaperPlane} from 'react-icons/fa6'

const Form = () => {
    return (
        <div className={style.form}>
            <form action='https://formsubmit.co/m.afnan2018@gmail.com' method='POST'>
                <input type="text" name="name" placeholder='Enter Your Name' required />
                <input type="email" name="email" placeholder='Enter Your email address' required />
                <input type='text' name='subject' placeholder='Enter Your Subject' required/>
                <input type="hidden" name="_captcha" value="false"></input>
                <input type="hidden" name="_template" value="table"></input>
                <input type="hidden" name="_subject" value="Portfolio - Hire"></input>
                <textarea cols="30" rows="10" name='message' placeholder='Enter Your Message' required/>
                <button type="submit">Send Message <FaPaperPlane/></button>
            </form>
        </div>
    )
}

export default Form