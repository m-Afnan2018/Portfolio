import React from 'react'
import style from './HeroSection.module.css'
import circle from '../../assets/images/userAssets/circle.png'
import cube from '../../assets/images/userAssets/cube.png'
import dots from '../../assets/images/userAssets/dots.png'
import plus from '../../assets/images/userAssets/plus.png'
import zigzag from '../../assets/images/userAssets/zigzags.png'
import user from '../../assets/images/userAssets/UserImage.png'

const Image = () => {
  return (
    <div className={style.Image}>
        <div>
            <img src={user} alt='user'/>
        </div>
        <img className={style.circle} src={circle} alt='circle'/>
        <img className={style.cube} src={cube} alt='cube'/>
        <img className={style.dots} src={dots} alt='dots'/>
        <img className={style.plus} src={plus} alt='plus'/>
        <img className={style.zigzag} src={zigzag} alt='zigzag'/>
    </div>
  )
}

export default Image