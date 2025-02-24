import { useEffect, useState } from 'react'
import "./MainNav.css";
import { IoNotifications } from "react-icons/io5";
import { useNavContext } from '../../global-context/NavContext';

const MainNav = () => {
    const { setIsMobileNavClicked } = useNavContext();
    const [isMobile, setIsMobile] = useState<Boolean>(false);
    const [isNotificationClicked, setIsNotificationClicked] = useState<Boolean>(false);
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

    const handleNotificationsClick = () => {
        setIsNotificationClicked(!isNotificationClicked);
    }
  return (
    <div className='mainnav'>
        {isMobile && 
            <h1 
                onClick={() => setIsMobileNavClicked(true)}
                style={{cursor: 'pointer'}}
            >
                    ☰
            </h1>
        }
        <h1>Sound Secure</h1>
        <div className='notification-icon'>
            <IoNotifications className='profile-icon' size="2em" color='#62B2C0' onClick={handleNotificationsClick}/>
            {isNotificationClicked && 
                <div className='notification-container'>
                    Notifications
                </div>
            }
        </div>
    </div>
  )
}

export default MainNav