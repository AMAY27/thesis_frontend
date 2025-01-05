import "../SideNav/SideNav.css";
import { useNavContext } from "../../global-context/NavContext";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

const SideNav = () => {
    const { clickedNavItem, setClickedNavItem } = useNavContext();
    // const navigate = useNavigate();
    
    const handleNavigation = (navItem: string) => {
        setClickedNavItem(navItem);
        // navigate(`/${navItem}`);
    }

    const navItems = [
        {item:"alerts", title:"Alerts"}, 
        {item: "livestream", title:"Live Stream"}, 
        {item: "customevents", title:"Custom Events"}, 
        {item: "historical", title:"Historical Events"}
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
                            {navItem.title}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default SideNav;