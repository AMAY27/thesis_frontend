import "../SideNav/SideNav.css";
import { useNavContext } from "../../global-context/NavContext";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";

const SideNav = () => {
    const { clickedNavItem, setClickedNavItem } = useNavContext();
    const [ hoverClass, setHoverClass ] = useState<Boolean>(false);
    // const navigate = useNavigate();
    
    const handleNavigation = (navItem: string) => {
        setClickedNavItem(navItem);
        // navigate(`/${navItem}`);
    }

    function handleHoverClass() {
        setHoverClass(true);
    }

    const navItems = [{item:"alerts", title:"Alerts"}, {item: "livestream", title:"Live Stream"}, {item: "customevents", title:"Custom Events"}, {item: "historical", title:"Historical Events"}];
    return(
        <div className="sidenav">
            <ul className="navlist">
                {navItems.map((navItem) => {
                    return (
                        <li
                            key={navItem.item}
                            className={`navitems ${clickedNavItem === navItem.item ? "active" : ""}`}
                            onMouseEnter={handleHoverClass}
                            onClick={() => handleNavigation(navItem.item)}
                        >
                            {navItem.title}
                        </li>
                    )
                })}
                {/* <li 
                    className="navitems"
                    style={{ 
                        backgroundColor: clickedNavItem === "alerts" ? "#166876" : "transparent",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                    onClick={() => handleNavigation("alerts")}
                >
                    Alerts
                </li>
                <li 
                    className="navitems"
                    style={{ 
                        backgroundColor: clickedNavItem === "livestream" ? "#166876" : "transparent",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                    //style={{ backgroundColor: clickedNavItem === "livestream" ? "#166876" : "transparent" }} 
                    onClick={() => handleNavigation("livestream")}
                >
                    Live Stream
                </li>
                <li 
                    className="navitems"
                    style={{ 
                        backgroundColor: clickedNavItem === "customevents" ? "#166876" : "transparent",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }} 
                    onClick={() => handleNavigation("customevents")}
                >
                    Custom Events
                </li>
                <li 
                    className="navitems"
                    style={{ 
                        backgroundColor: clickedNavItem === "historical" ? "#166876" : "transparent",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                    //style={{ backgroundColor: clickedNavItem === "historical" ? "#166876" : "transparent" }} 
                    onClick={() => handleNavigation("historical")}
                >
                    Historical Events
                </li> */}
            </ul>
        </div>
    )
}

export default SideNav