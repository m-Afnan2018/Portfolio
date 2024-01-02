import React from 'react'
import style from './Project.module.css'
import { FaGithub, FaLink  } from "react-icons/fa";

const SingleProject = ({ index, data }) => {
    return (
        <div className={`${index & 1 ? style.projectLeft : style.projectRight} ${style.singleProject}`} style={{backgroundImage: `url(${data.image})`}}>
            <div className={`${index & 1 ? style.numberLeft : style.numberRight} ${style.number}`}>0{index+1}</div>
            <div className={`${index & 1 ? style.cardLeft : style.cardRight} ${style.card}`}>

                <div className={style.skills}>
                    {
                        data.techStack.map((tech, index) => (
                            <img loading="lazy" src={tech} alt="" key={index}/>
                        ))
                    }
                </div>

                <h2 className={style.heading}>{data.name}</h2>

                <p className={style.description}>{data.description}</p>
                <div className={style.buttons}>
                    <button>Read More</button>
                    <FaGithub onClick={data.githubLink} className={style.icon}/>
                    <FaLink onClick={data.liveLink} className={style.icon}/>
                </div>
            </div>
        </div>
    )
}

export default SingleProject