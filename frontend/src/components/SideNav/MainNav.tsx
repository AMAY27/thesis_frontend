import { useEffect, useState } from 'react'
import "./MainNav.css";

const MainNav = () => {
    const [isMobile, setIsMobile] = useState<Boolean>(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 486);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])
  return (
    <div className='mainnav'>
        {isMobile && <div>☰</div>}
        <h3>Sound Secure</h3>
    </div>
  )
}

export default MainNav