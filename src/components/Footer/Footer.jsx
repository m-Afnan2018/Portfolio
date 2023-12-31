import React from 'react'
import { Link } from 'react-scroll'
import style from './Footer.module.css'
import { FaEnvelope, FaGithub, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
    return (
        <div className={style.Footer}>
            <div>
                <div className={style.name}>Mohammad Afnan</div>
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
            <div>
                <FaLinkedin />
                <FaGithub />
                <FaTwitter />
                <FaInstagram />
                <FaEnvelope />
            </div>
        </div>
    )
}

export default Footer