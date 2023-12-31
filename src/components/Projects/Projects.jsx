import React from 'react'
import style from './Project.module.css'
import SingleProject from './SingleProject'
import projectData from '../../assets/data/projectData'

const Projects = () => {
    return (
        <div className={style.Projects} id='projects'>
            <h3>Project</h3>
            <div>
                {
                    projectData.map((data, index) => (
                        <SingleProject data={data} key={index} index={index}/>
                    ))
                }
            </div>
        </div>
    )
}

export default Projects