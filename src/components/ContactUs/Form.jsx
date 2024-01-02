import React, { useState } from 'react'
import style from './ContactUs.module.css'
import { FaPaperPlane } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import '../../../node_modules/react-toastify/dist/ReactToastify.css';

const Form = ({ setSubmitted }) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })

    const [loader, setLoader] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        setLoader(true);
        e.preventDefault();

        await fetch("https://formsubmit.co/ajax/m.afnan2018@gmail.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                _captcha: false,
                _template: 'table',
                _subject: 'Portfolio - Hire',
                message: formData.message,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setLoader(false);
                if (data.success === 'true') {
                    setSubmitted(true);
                    toast.success("Message sent successfully");
                } else {
                    toast.error("Network Issue");
                }
            })
            .catch(() => {
                toast.error("Internal server error");
            })

    }
    return (
        <div className={style.form}>
            {
                loader ? <div className={style.loader}></div> :

                    <form onSubmit={handleSubmit} autoComplete='off'>
                        <input type="text" onChange={handleChange} value={formData.name} name="name" placeholder='Enter Your Name' required />
                        <input type="email" onChange={handleChange} value={formData.email} name="email" placeholder='Enter Your email address' required />
                        <input type='text' onChange={handleChange} value={formData.subject} name='subject' placeholder='Enter Your Subject' required />
                        <input type="hidden" name="_captcha" value="false"></input>
                        <input type="hidden" name="_template" value="table"></input>
                        <input type="hidden" name="_subject" value="Portfolio - Hire"></input>
                        <textarea cols="30" onChange={handleChange} value={formData.message} rows="10" name='message' placeholder='Enter Your Message' required />
                        <button type="submit">Send Message <FaPaperPlane /></button>
                    </form>
            }
        </div>
    )
}

export default Form