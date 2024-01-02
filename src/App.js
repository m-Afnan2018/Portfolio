import { ToastContainer } from 'react-toastify';
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
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default App;
