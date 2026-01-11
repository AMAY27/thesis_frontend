import { useEffect, useRef, useState } from 'react';
import './MainNav.css';
import { useNavigate } from 'react-router-dom';
import { IoNotifications } from 'react-icons/io5';
import { useNavContext } from '../../global-context/NavContext';

const MainNav = () => {
  const { setIsMobileNavClicked } = useNavContext();
  const [isMobile, setIsMobile] = useState<Boolean>(false);
  const [isNotificationClicked, setIsNotificationClicked] = useState<Boolean>(false);
  const notificationDivRef = useRef<HTMLDivElement | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(1);
  const { clickedNavItem, setClickedNavItem } = useNavContext();
  const navigate = useNavigate();

  const handleNavigation = (navItem: string) => {
    localStorage.setItem('clickedNavItem', navItem);
    setClickedNavItem(navItem);
    navigate(`/${navItem}`);
  };

  const navItems = [
      {
        item: 'alerts',
        title: 'Alerts',
        // icon: <MdOutlineCrisisAlert style={{ fontSize: '1.5rem' }} />,
      },
      {
        item: 'livestream',
        title: 'Live Stream',
        // icon: <SiAudiomack style={{ fontSize: '1.5rem' }} />,
      },
      {
        item: 'customevents',
        title: 'Custom Events',
        // icon: <MdOutlineDashboardCustomize style={{ fontSize: '1.5rem' }} />,
      },
    ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 720);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationDivRef.current &&
        !notificationDivRef.current.contains(event.target as Node)
      ) {
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
  };
  return (
    <div className="mainnav">
      {isMobile && (
        <h1 onClick={() => setIsMobileNavClicked(true)} style={{ cursor: 'pointer' }}>
          ☰
        </h1>
      )}
      <h1>Sound Secure</h1>
      <div className="nav-items" style={{display: "flex", gap: "2", alignItems: "center"}}>
        {navItems.map((navItem) => {
          return (
            <div
              key={navItem.item}
              className={`nav-item ${clickedNavItem === navItem.item ? 'active' : ''}`}
              onClick={() => handleNavigation(navItem.item)}
              style={{
                height: "100%",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                fontSize: "1rem",
                // borderBottom: clickedNavItem === navItem.item ? "3px solid #62B2C0" : "none",
                cursor: "pointer"
              }}
            >
              {navItem.title}
            </div>
          );
        })}
        <div className="notification-icon" ref={notificationDivRef} style={{marginLeft: "10px"}}>
        <IoNotifications
          className="profile-icon"
          size="2em"
          color="#166876"
          onClick={handleNotificationsClick}
        />
        {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
        {isNotificationClicked && (
          <>
            <div className="notification-container">
              {/* <h3>Notifications</h3> */}
              <h3>June 06, 2025</h3>
              <div className="notification-card">
                <h3>Breaking occured more than 3 times</h3>
                <div className="logs">
                  <span>13:00</span>
                  <span>13:12</span>
                  <span>13:15</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default MainNav;
