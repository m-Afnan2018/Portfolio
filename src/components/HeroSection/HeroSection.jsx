import React from 'react'
import style from './HeroSection.module.css'
import AboutMe from './AboutMe'
import Image from './Image'

const HeroSection = () => {
    return (
        <div className={style.HeroSection}>
            <AboutMe/>
            <Image/>
        </div>
    )
}

export default HeroSection