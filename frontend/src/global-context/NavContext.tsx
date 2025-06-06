import { createContext, ReactNode, useState, useContext } from "react";

interface NavContextProviderProps {
    children: ReactNode;
}

interface NavContextProps {
    clickedNavItem: string;
    setClickedNavItem: (clickedNavItem: string) => void;
    isMobileNavClicked: boolean;
    setIsMobileNavClicked: (isMobileNavClicked: boolean) => void;
}

const NavContext = createContext<NavContextProps >({
    clickedNavItem: "alerts",
    setClickedNavItem: () => {},
    isMobileNavClicked: false,
    setIsMobileNavClicked: () => {},
});

export const NavContextProvider = ({ children }: NavContextProviderProps) => {
    const navItem = localStorage.getItem("clickedNavItem") || "alerts";
    const [clickedNavItem, setClickedNavItem] = useState<string>(navItem);
    const [isMobileNavClicked, setIsMobileNavClicked] = useState<boolean>(false);
    const contextData = {
        clickedNavItem,
        setClickedNavItem,
        isMobileNavClicked,
        setIsMobileNavClicked,
    };
    return (
        <NavContext.Provider value={contextData}>{children}</NavContext.Provider>
    )
}

export const useNavContext = () => {
    const context = useContext(NavContext);
    if (!context) {
        throw new Error("useNavContext must be used within a NavContextProvider");
    }
    return context;
}