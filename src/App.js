import './App.css';
import ContactUs from './components/ContactUs/ContactUs';
import Footer from './components/Footer/Footer';
import HeroSection from './components/HeroSection/HeroSection';
import Navbar from './components/Navbar/Navbar'
import Projects from './components/Projects/Projects';
import TechStack from './components/TechStack/TechStack';

function App() {
    return (
        <div className="App">
            <Navbar/>
            <HeroSection/>
            <Projects/>
            <TechStack/>
            <ContactUs/>
            <Footer/>
        </div>
    );
}

export default App;
