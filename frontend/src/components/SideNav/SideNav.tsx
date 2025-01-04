import "../SideNav/SideNav.css";
import { useNavContext } from "../../global-context/NavContext";
import { useNavigate } from "react-router-dom";

const SideNav = () => {
    const { clickedNavItem, setClickedNavItem } = useNavContext();
    const navigate = useNavigate();
    
    const handleNavigation = (navItem: string) => {
        setClickedNavItem(navItem);
        // navigate(`/${navItem}`);
    }
    return(
        <div className="sidenav">
            <ul className="navlist">
                <li 
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
                    //style={{ backgroundColor: clickedNavItem === "customevents" ? "#166876" : "transparent" }} 
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
                </li>
            </ul>
        </div>
    )
}

export default SideNav