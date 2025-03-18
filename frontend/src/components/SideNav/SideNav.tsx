import "../SideNav/SideNav.css";
import { useNavContext } from "../../global-context/NavContext";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineCrisisAlert, MdOutlineDashboardCustomize } from "react-icons/md";
import { SiAudiomack } from "react-icons/si";
import { PiMonitorPlayBold  } from "react-icons/pi";

const SideNav = () => {
    const { clickedNavItem, setClickedNavItem } = useNavContext();
    const navigate = useNavigate();
    
    const handleNavigation = (navItem: string) => {
        setClickedNavItem(navItem);
        navigate(`/${navItem}`);
    }

    const navItems = [
        {item:"alerts", title:"Alerts", icon: <MdOutlineCrisisAlert style={{fontSize:"1.5rem"}}/>}, 
        {item: "livestream", title:"Live Stream", icon: <SiAudiomack style={{fontSize:"1.5rem"}}/>}, 
        {item: "customevents", title:"Custom Events", icon: <MdOutlineDashboardCustomize style={{fontSize:"1.5rem"}}/>}, 
        {item: "eventsmonitor", title:"Events Monitor", icon: <PiMonitorPlayBold style={{fontSize:"1.5rem"}}/>}
    ];

    return(
        <div className="sidenav">
            <ul className="navlist">
                {navItems.map((navItem) => {
                    return (
                        <li
                            key={navItem.item}
                            className={`navitems ${clickedNavItem === navItem.item ? "active" : ""}`}
                            onClick={() => handleNavigation(navItem.item)}
                        >
                            {navItem.icon}
                            {navItem.title}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default SideNav;