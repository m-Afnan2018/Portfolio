import React, { useEffect, useRef, useState } from 'react'
import style from './Project.module.css'
import { FaArrowLeft, FaArrowRight, FaGithub } from 'react-icons/fa'
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaLink, FaYoutube } from 'react-icons/fa6'
import useOnClickOutside from '../../hooks/useOnClickOutside';

const ProjectModal = ({ data, setShow, show }) => {
    const [image, selectImage] = useState(data.image);
    const thumbnailRef = useRef();
    const [isScrollable, setIsScrollable] = useState(true);
    const modalRef = useRef();
    const [allLoad, setAllLoad] = useState(true);
    useOnClickOutside(modalRef, ()=>setShow(false));

    const handleNextImage = () => {
        const currentIndex = data.moreImages.indexOf(image);
        const nextIndex = (currentIndex + 1) % data.moreImages.length;
        const nextImage = data.moreImages[nextIndex];
        selectImage(nextImage);
    };

    const handlePrevImage = () => {
        const currentIndex = data.moreImages.indexOf(image);
        const prevIndex = (currentIndex - 1 + data.moreImages.length) % data.moreImages.length;
        const prevImage = data.moreImages[prevIndex];
        selectImage(prevImage);
    };

    useEffect(() => {
        const updateScrollable = () => {
            const container = thumbnailRef.current;
            if (container) {
                setIsScrollable(container.scrollWidth > container.clientWidth);
            }
        };

        // Initial update
        updateScrollable();

        // Update on window resize
        window.addEventListener('resize', updateScrollable);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateScrollable);
        };
    }, [data.moreImages, allLoad]);

    const scrollThumbnail = (direction) => {
        const container = thumbnailRef.current;
        const scrollAmount = 100; // Adjust as needed
        if (container) {
            if (direction === 'left') {
                container.scrollTo({
                    left: container.scrollLeft - scrollAmount,
                    behavior: 'smooth',
                });
            } else {
                container.scrollTo({
                    left: container.scrollLeft + scrollAmount,
                    behavior: 'smooth',
                });
            }
        }
    };
    

    return (
        <div className={`${style.ProjectModal} ${ show ? style.showModal : style.hideModal}`} ref={modalRef}>
            <div className={style.image}>
                <div className={style.mainImage}>
                    <div className={style.left} onClick={() => handlePrevImage()}>
                        <FaArrowLeft />
                    </div>
                    <img src={image} alt='mainImage' />
                    <div className={style.right} onClick={() => handleNextImage()} >
                        <FaArrowRight />
                    </div>
                </div>
                <div className={style.thumbnailImage}>
                    {isScrollable &&
                        <div className={style.arrows} onClick={() => scrollThumbnail('left')}>
                            <FaArrowLeft />
                        </div>}
                    <div className={style.thumbnail} ref={thumbnailRef}>
                        {
                            data.moreImages.map((i, index) => (
                                <img onLoad={()=>setAllLoad(!allLoad)} className={image === i ? style.selected : ''} key={index} src={i} onClick={() => selectImage(i)} alt='thumbnail' />
                            ))
                        }
                    </div>
                    {isScrollable &&
                        <div className={style.arrows} onClick={() => scrollThumbnail('right')}>
                            <FaArrowRight />
                        </div>}
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
                        <FaGithub onClick={()=>window.open(data.githubLink, '_blank')} />
                        <FaYoutube onClick={()=>window.open(data.youtubeLink, '_blank')} />
                        <FaLink onClick={()=>window.open(data.liveLink, '_blank')} />
                    </div>

                </div>
                <IoCloseCircleOutline className={style.cross} onClick={() => setShow(false)} />
            </div>
        </div>
    )
}

export default ProjectModal