import React from "react";
import style from "./TechStack.module.css";
import skillsImages from "./skillsImages";
// import '../../assets/stack/Bash.svg'
const TechStack = () => {
  return (
    <div className={style.techStack}>
      {/* Left div */}
      <div className={style.description}>
        <h2>
          <span>M</span>e and <br />
          My Tech Stack
        </h2>
        {/* <h2>My Tech Stack</h2> */}
        <p>
          Hi Everyone My name is John Doe I am a Full Stack Web Developer I have
          been working for last 3 Years and Currently I am working with a
          Budding Startup in USA and a full Time Freelancer. Currently I am
          working on NextJs and Making Beautiful UI-UX are my fey features
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non
          doloremque aspernatur, maiores voluptatum minus laudantium?
          Perspiciatis accusamus minima porro dolores necessitatibus, magni
          dolorem et qui veniam nulla sequi molestiae maxime.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis quidem
          quos ullam veritatis voluptates tenetur qui ipsa nulla culpa itaque?
        </p>
      </div>
      {/* Right Div */}
      <div className={style.skills}>
        <img className={style.skillBlob} src="https://res.cloudinary.com/di1qrcflg/image/upload/v1704002443/blob_vector_zq3nmk.png" />
        {skillsImages.map((image) => (
          <img className={style.skillImg} src={image.url} alt={image.alt} />
        ))}
      </div>
    </div>
  );
};

export default TechStack;
