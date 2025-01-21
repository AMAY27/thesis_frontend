import { useEffect, useState } from 'react'
import "./MainNav.css";
import { CgProfile } from "react-icons/cg";

const MainNav = () => {
    const [isMobile, setIsMobile] = useState<Boolean>(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 720);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])
  return (
    <div className='mainnav'>
        {isMobile && <h1>☰</h1>}
        <h1>Sound Secure</h1>
        <CgProfile className='profile-icon' size="2em"/>
    </div>
  )
}

export default MainNav