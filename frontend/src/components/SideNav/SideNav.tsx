import "../SideNav/SideNav.css";

const SideNav = () => {
    return(
        <div className="sidenav">
            <ul className="navlist">
                <li className="navitems">Alerts</li>
                <li className="navitems">Live Stream</li>
                <li className="navitems">Custom Events</li>
                <li className="navitems">Historical Events</li>
            </ul>
        </div>
    )
}

export default SideNav