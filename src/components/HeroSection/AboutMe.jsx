import React, { useEffect } from 'react'
import style from './HeroSection.module.css'
import Typed from 'typed.js';

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
        <div>
            <h3>Hi! Mohammad Afnan</h3>

            <div>
                <p>I am <span className='role'></span></p>
            </div>
            <p>I’m a software developer and here is my portfolio website. Here you’ll learn about my journey as a software developer.</p>
            <div>
                Hire Me
            </div>
        </div>
    )
}

export default AboutMe