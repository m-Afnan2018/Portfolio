import React from 'react'
import style from './Navbar.module.css'
import lettera from '../../assets/images/letter-a.png'
import letterm from '../../assets/images/letter-m.png'
import { Link } from 'react-scroll'

const Navbar = () => {
    return (
        <div className={style.Navbar}>
            <div className={style.Name}>
                <div>
                    <img src={letterm} />
                    <p>ohammad</p>
                </div>
                <div>
                    <img src={lettera} />
                    <p>fnan</p>
                </div>
            </div>
            <div className='Nav'>
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
            <div className='Nav-Overlay'>
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
    )
}

export default Navbar