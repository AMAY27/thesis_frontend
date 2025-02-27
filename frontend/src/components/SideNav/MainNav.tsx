import { useEffect, useRef, useState } from 'react'
import "./MainNav.css";
import { IoNotifications } from "react-icons/io5";
import { useNavContext } from '../../global-context/NavContext';

const MainNav = () => {
    const { setIsMobileNavClicked } = useNavContext();
    const [isMobile, setIsMobile] = useState<Boolean>(false);
    const [isNotificationClicked, setIsNotificationClicked] = useState<Boolean>(false);
    const notificationDivRef = useRef<HTMLDivElement | null>(null);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (notificationDivRef.current && !notificationDivRef.current.contains(event.target as Node)) {
            setIsNotificationClicked(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        <div className='notification-icon' ref={notificationDivRef}>
            <IoNotifications className='profile-icon' size="2em" color='#62B2C0' onClick={handleNotificationsClick}/>
            {isNotificationClicked && 
                <>
                    <div className='notification-container'>
                        {/* <h3>Notifications</h3> */}
                        <div className='no-notification'>
                            <h3>No notifications today</h3>
                        </div>
                    </div>
                </>
            }
        </div>
    </div>
  )
}

export default MainNav