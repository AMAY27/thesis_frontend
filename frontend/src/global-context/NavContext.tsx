import { createContext, ReactNode, useState, useContext } from "react";

interface NavContextProviderProps {
    children: ReactNode;
}

interface NavContextProps {
    clickedNavItem: string;
    setClickedNavItem: (clickedNavItem: string) => void;
}

const NavContext = createContext<NavContextProps >({
    clickedNavItem: "alerts",
    setClickedNavItem: () => {},
});

export const NavContextProvider = ({ children }: NavContextProviderProps) => {
    const [clickedNavItem, setClickedNavItem] = useState<string>("alerts");
    const contextData = {
        clickedNavItem,
        setClickedNavItem,
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