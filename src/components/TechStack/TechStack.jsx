import React from "react";
import style from "./TechStack.module.css";
import skillImage from "../../assets/data/skillImage";

const TechStack = () => {
    const exclude = ['NextJsCircle', 'Saas', 'Typescript']
    return (
        <div className={style.techStack} id="techStack">
            {/* Left div */}
            <div className={style.description}>
                <h2>
                    <span>M</span>e and <br />
                    My Tech Stack
                </h2>
                {/* <h2>My Tech Stack</h2> */}
                <p>
                    Hi there! I'm Mohammad Afnan, a passionate web developer with a knack for creating dynamic and responsive web applications. My tech stack is a blend of modern technologies that I leverage to build efficient and scalable solutions.
                </p>
                <p>
                    My expertise includes building full-stack web applications using React, Node.js, and Express, integrating RESTful APIs, and working with databases like MongoDB and PostgreSQL. I am also experienced in deploying applications to cloud platforms and optimizing performance for scalable solutions.
                </p>
                <p>
                    I am always eager to learn and adapt to new technologies, and I thrive in collaborative environments where I can contribute to innovative projects. Let's connect and create something amazing together!
                </p>
            </div>
            {/* Right Div */}
            <div className={style.skills}>
                <img className={style.skillBlob} loading='lazy' src="https://res.cloudinary.com/di1qrcflg/image/upload/v1704002443/blob_vector_zq3nmk.png" alt="blob" />
                {
                    Object.keys(skillImage).map((key) => (
                        !exclude.includes(key) && 
                        <img className={style.skillImg} loading="lazy" key={key} src={skillImage[key]} alt={key} />
                    ))

                }
            </div>
        </div>
    );
};

export default TechStack;
