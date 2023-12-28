import React, { useState } from 'react'
import style from './Navbar.module.css'
import lettera from '../../assets/images/letter-a.png'
import letterm from '../../assets/images/letter-m.png'
import { Link } from 'react-scroll'
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
    const [showOverLay, setShowOverLay] = useState(false)
    return (
        <div className={style.Navbar}>
            <div className={style.Name}>
                <div>
                    <img src={letterm} alt='M' />
                    <p>ohammad</p>
                </div>
                <div>
                    <img src={lettera} alt='A' />
                    <p>fnan</p>
                </div>
            </div>
            <div className={style.Nav}>
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
            <div className={style.NavOverlay}>
                <FiMenu onClick={() => setShowOverLay(!showOverLay)} />
                {
                    showOverLay &&
                    <div>
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
                }
            </div>
        </div>
    )
}

export default Navbar