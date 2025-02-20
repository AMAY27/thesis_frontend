import { useNavContext } from "../../global-context/NavContext";
import { useNavigate } from "react-router-dom";
import "./MobileNav.css";

const MobileNav = () => {
    const { setClickedNavItem, setIsMobileNavClicked } = useNavContext();
    const navigate = useNavigate();

    const handleNavigation = (navItem: string) => {
        setClickedNavItem(navItem);
        setIsMobileNavClicked(false);
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
        <div className="mobnav-head">
            <>
                <h2>Sound Secure</h2>
            </>
            <>
                <h4 onClick={() => setIsMobileNavClicked(false)}>X</h4>
            </>
        </div>
        <div className="mobnavlist">
            {navItems.map((navItem) => {
                return (
                    <div
                        key={navItem.item}
                        className="mobnavitems"
                        onClick={() => handleNavigation(navItem.item)}
                    >
                        {navItem.title}
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MobileNav