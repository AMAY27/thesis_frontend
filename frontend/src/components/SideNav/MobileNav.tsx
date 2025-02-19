import { useNavContext } from "../../global-context/NavContext";
import { useNavigate } from "react-router-dom";
import "./MobileNav.css";

const MobileNav = () => {
    const { setClickedNavItem, setIsMobileNavClicked } = useNavContext();
    const navigate = useNavigate();

    const handleNavigation = (navItem: string) => {
        setClickedNavItem(navItem);
        navigate(`/${navItem}`);
    }

    const navItems = [
        {item:"alerts", title:"Alerts"}, 
        {item: "livestream", title:"Live Stream"}, 
        {item: "customevents", title:"Custom Events"}, 
        {item: "eventsmonitor", title:"Events Monitor"}
    ];
  return (
    <div className="mobnav">
        <h2>Sound Secure</h2>
        <p onClick={() => setIsMobileNavClicked(false)}>X</p>
        <ul className="mobnavlist">
            {navItems.map((navItem) => {
                return (
                    <li
                        key={navItem.item}
                        className="mobnavitems"
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

export default MobileNav