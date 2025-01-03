import MainNav from "../components/SideNav/MainNav";
import SideNav from "../components/SideNav/SideNav"
import "../hoc/hoc.css";

const hoc = (WrappedComponent: React.FC<any>) => {
    return(props: any) => {
        return (
            <div className="parent-container">
                <MainNav/>
                <div className="hoc-layer-one">
                    <SideNav/>
                    <WrappedComponent {...props} />
                </div>
            </div>
        )
    }
}

export default hoc;