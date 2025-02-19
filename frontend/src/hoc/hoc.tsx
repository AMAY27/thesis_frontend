import MainNav from "../components/SideNav/MainNav";
import SideNav from "../components/SideNav/SideNav"
import "../hoc/hoc.css";
import MobileNav from "../components/SideNav/MobileNav";
import { useNavContext } from "../global-context/NavContext";

const hoc = (WrappedComponent: React.FC<any>) => {
    return(props: any) => {
        const { isMobileNavClicked } = useNavContext();
        return (
            <div className="parent-container">
                {isMobileNavClicked && 
                    <div className="mob-nav-overlay">
                        <MobileNav/>
                    </div>
                }
                <div className="hoc-layer-one">
                    <div className="hoc-fixed-layer">
                        <SideNav/>
                    </div>
                    <div className="hoc-layer-two">
                        <div className="nav-fixed">
                            <MainNav/>
                        </div>
                        <div className="content-scrollable">
                            <WrappedComponent {...props} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default hoc;