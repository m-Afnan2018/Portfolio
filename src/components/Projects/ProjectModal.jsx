import React, { useState } from 'react'
import style from './Project.module.css'
import { FaGithub } from 'react-icons/fa'
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaLink, FaYoutube } from 'react-icons/fa6'

const ProjectModal = ({ data, setShow }) => {
    const [image, selectImage] = useState(data.image);
    return (
        <div className={style.ProjectModal}>
            <div className={style.image}>
                <img src={image} alt='mainImage' />
                <div className={style.thumbnail}>
                    {
                        data.moreImages.map((i) => (
                            <img className={image === i ? style.selected : ''} src={i} onClick={() => selectImage(i)} alt='thumbnail' />
                        ))
                    }
                </div>
            </div>
            <div className={style.information}>
                <div>
                    <h1>{data.name}</h1>
                    <h2>{data.description}</h2>
                </div>
                <div>

                    <h3>Features: </h3>
                    <ul className={style.features}>
                        {
                            data.points.map((point) => (
                                <li>{point}</li>
                            ))
                        }
                    </ul>
                </div>
                <div>
                    <h3>Tech Stack: </h3>
                    <div className={style.tech}>
                        {
                            data.techStack.map((tech) => (
                                <div>{tech}</div>
                            ))
                        }
                    </div>

                </div>
                <div>
                    <h3>Links: </h3>
                    <div className={style.links}>
                        <FaGithub />
                        <FaYoutube />
                        <FaLink />
                    </div>

                </div>
                <IoCloseCircleOutline className={style.cross} onClick={() => setShow(false)} />
            </div>
        </div>
    )
}

export default ProjectModal