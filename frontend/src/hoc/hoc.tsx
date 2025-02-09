import MainNav from "../components/SideNav/MainNav";
import SideNav from "../components/SideNav/SideNav"
import "../hoc/hoc.css";

const hoc = (WrappedComponent: React.FC<any>) => {
    return(props: any) => {
        return (
            <div className="parent-container">
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