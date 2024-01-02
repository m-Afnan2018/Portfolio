import React, { useEffect } from 'react'
import style from './HeroSection.module.css'
import Typed from 'typed.js';
import { Link } from 'react-scroll';

const AboutMe = () => {

    useEffect(() => {
        // Strings to be typed
        const strings = [
            'Full Stack Developer',
            'Web Developer',
            'UI-UX Designer',
            'Backend Developer',
            'Coder',
        ];

        // Options for Typed.js
        const options = {
            strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 80,
            backDelay: 1000,
        };

        // Create a new Typed instance
        const typeData = new Typed('.role', options);

        // Cleanup on component unmount
        return () => {
            typeData.destroy();
        };
    }, []);
    return (
        <div className={style.AboutMe}>
            <h3>Hi! Mohammad Afnan</h3>
            <div>
                <p className={style.intro}>I am <span className={`${style.role} role`}></span></p>
            </div>
            <div className={style.para}>
                <p>I’m a software developer and here is my portfolio website.</p>
                <p>Here you’ll learn about my journey as a software developer.</p>
            </div>
            <Link to="contactUs" smooth={true} duration={500}>
                <div className={style.btn}>
                    Hire Me
                </div>
            </Link>
        </div>
    )
}

export default AboutMe