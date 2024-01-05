import React from 'react'
import style from './Project.module.css'
import ReactImageGallery from 'react-image-gallery'
import { FaGithub } from 'react-icons/fa'
import { FaLink, FaYoutube } from 'react-icons/fa6'

const ProjectModal = ({ data }) => {
    return (
        <div className={style.ProjectModal}>
            <div>
                <ReactImageGallery items={data.moreImages} />
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
            </div>
        </div>
    )
}

export default ProjectModal