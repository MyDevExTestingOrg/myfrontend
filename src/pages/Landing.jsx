import {useState,useEffect} from 'react'
import Navbar from '../component/Navbar.jsx'
import HeroSection from '../component/HeroSection.jsx'
import Features from '../component/Features.jsx'
import MarketGap from '../component/MarketGap.jsx'
import Founder from '../component/Founder.jsx'
import Footer from '../component/Footer.jsx'
function Landing() {
  const [darkMode,setDarkMode] = useState(false);


  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
  

  return (
    <div  className="min-h-screen bg-white ">
    <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
    <HeroSection/>
    <Features/>
    <MarketGap/>
    <Founder/>
    <Footer/>
    </div>
  )
}

export default Landing