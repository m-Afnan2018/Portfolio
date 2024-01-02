import React, { useState } from 'react'
import style from './ContactUs.module.css'
import Form from './Form'
import Thanks from './Thanks'

const ContactUs = () => {
    const [submitted, setSubmitted] = useState(false);
    return (
        <div className={style.contactUs} id='contactUs'>
            <h1>Contact Me</h1>
            { !submitted &&  <p>Questions, Thoughts, Or Just Want To Say Hello?</p>}
            
            {
                submitted ? <Thanks /> :
                    <Form setSubmitted={setSubmitted} />
            }
        </div>
    )
}

export default ContactUs