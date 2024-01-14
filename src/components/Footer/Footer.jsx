import React from 'react'
import { Link } from 'react-scroll'
import style from './Footer.module.css'
import { FaEnvelope, FaGithub, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
    return (
        <div className={style.Footer}>
            <div>
                <div className={style.name}>Afnan</div>
                <div className={style.link}>
                    <Link to="projects" smooth={true} duration={500}>
                        Projects
                    </Link>
                    <Link to="techStack" smooth={true} duration={500}>
                        Skills
                    </Link>
                    <Link to="contactUs" smooth={true} duration={500}>
                        Contact me
                    </Link>
                </div>
            </div>
            <div className={style.icons}>
                <FaLinkedin onClick={()=>window.open('https://www.linkedin.com/in/mafnan2018/', '_blank')}/>
                <FaGithub onClick={()=>window.open('https://github.com/m-Afnan2018/', '_blank')}/>
                <FaTwitter onClick={()=>window.open('https://twitter.com/m_Afnan2018/', '_blank')}/>
                <FaInstagram onClick={()=>window.open('https://www.instagram.com/m.afnan2018/', '_blank')}/>
                <FaEnvelope onClick={()=>window.open('mailto:m.afnan2018@gmail.com', '_blank')}/>
            </div>
        </div>
    )
}

export default Footer