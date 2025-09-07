import ProjectImage from "./projectImage"
import skillImage from "./skillImage"

const projectData = [
    {
        image: ProjectImage.Project1.main,
        moreImages: ProjectImage.Project1.others,
        techStackImages: [skillImage.HTML, skillImage.CSS, skillImage.Javascript, skillImage.Express, skillImage.NextJsCircle],
        techStack: ['HTML', 'CSS', 'JavaScript', 'Express', 'Node.js', 'MongoDB', 'React'],
        name: 'StudyNotion',
        description: 'Built a high-performance website where instructor can sell their courses to students',
        readMore: 'Developed a web application that allows instructors to create and manage their courses.',
        githubLink: 'https://www.github.com/m-Afnan2018/StudyNotion-Backend',
        liveLink: 'https://www.studynotion-edtech-project.vercel.app',
        youtubeLink: 'https://www.studynotion-edtech-project.vercel.app',
        points: [
            'Users can Buy courses and view them in their dashboard.',
            'Instructors can create and manage their courses.',
            'The platform supports various payment methods.',
        ],
        multiImages: [

        ]
    },
    {
        image: ProjectImage.Project2.main,
        moreImages: ProjectImage.Project2.others,
        techStackImages: [skillImage.HTML, skillImage.CSS, skillImage.Javascript, skillImage.Express, skillImage.NextJsCircle],
        techStack: ['HTML', 'CSS', 'JavaScript', 'React', 'Firebase', 'Node.js'],
        name: 'Dynamic GIF Generator',
        description: 'Developed a web application that allows users to create and customize GIFs using various templates and effects',
        readMore: 'Implemented user authentication and profile management using Firebase.',
        githubLink: 'https://github.com/m-Afnan2018/College-Minor-Project',
        liveLink: 'https://dynamicgifgenerator.vercel.app',
        youtubeLink: '',
        points: [
            'Users can generate GIFs from Prompts',
            'Users can chat with other users using GIF stickers',
            'The application supports user authentication and profile management',
        ],
        multiImages: [

        ]
    },
    {
        image: ProjectImage.Project3.main,
        moreImages: ProjectImage.Project3.others,
        techStackImages: [skillImage.HTML, skillImage.CSS, skillImage.Javascript, skillImage.Express, skillImage.NextJsCircle],
        techStack: ['HTML', 'CSS', 'JavaScript', 'React', 'Express', 'MongoDB', 'Cloudinary'],
        name: 'Flawsome',
        description: 'Its a saree selling website where you can buy sarees of different varieties',
        readMore: 'The website offers a wide range of sarees with detailed descriptions and high-quality images.',
        githubLink: 'https://github.com/m-Afnan2018/Flawsome',
        liveLink: 'https://flawsome.in',
        youtubeLink: '',
        points: [
            'The website offers a wide range of sarees with detailed descriptions and high-quality images.',
            'Users can easily browse and filter sarees by category, color, and price.',
            'The website provides a secure and seamless shopping experience.',
        ],
        multiImages: [

        ]
    },
    {
        image: ProjectImage.Project4.main,
        moreImages: ProjectImage.Project4.others,
        techStackImages: [skillImage.HTML, skillImage.CSS, skillImage.Javascript, skillImage.Express, skillImage.NextJsCircle],
        techStack: ['HTML', 'CSS', 'JavaScript', 'Express'],
        name: 'Om Tara Foundation',
        description: 'Its is a NGO website which is working for the betterment of the society',
        readMore: 'The website provides information about various social initiatives and how to get involved.',
        githubLink: 'https://github.com/m-Afnan2018/client',
        liveLink: 'https://client-omega-cyan.vercel.app',
        youtubeLink: 'https://github.com/m-Afnan2018/client',
        points: [
            'Information about various social initiatives and how to get involved.',
            'Details about the NGO\'s mission and vision.',
            'People can donate to the NGO through the website.',
        ],
        multiImages: [

        ]
    },
];

export default projectData;