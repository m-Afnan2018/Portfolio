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
                <img src={image} alt='mainImage'/>
                <div className={style.thumbnail}>
                    { 
                        data.moreImages.map((i)=>(
                            <img src={i} onClick={()=>selectImage(i)} alt='thumbnail'/>
                        ))
                    }
                </div>
            </div>
            <div className={style.information}>
                <h1>{data.name}</h1>
                <h2>{data.description}</h2>
                <h3>Features: </h3>
                <ul>
                    {
                        data.points.map((point) => (
                            <li>{point}</li>
                        ))
                    }
                </ul>
                <h3>Tech Stack: </h3>
                <div>
                    {
                        data.techStack.map((tech)=>(
                            <div>{tech}</div>
                        ))
                    }
                </div>
                <h3>Links: </h3>
                <div>
                    <FaGithub/>
                    <FaYoutube/>
                    <FaLink/>
                </div>
                <IoCloseCircleOutline className={style.cross} onClick={()=>setShow(false)}/>
            </div>
        </div>
    )
}

export default ProjectModal