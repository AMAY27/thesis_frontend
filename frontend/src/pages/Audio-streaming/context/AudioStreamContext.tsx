import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { LiveEvent } from "../types";
import { getTopTenLiveEvents } from "../indexDBServices";

interface AudioStreamContextProviderProps {
    children: ReactNode;
}

interface AudioStreamContextProps {
    liveEvents: LiveEvent[];
    setLiveEvents: (liveEvents: LiveEvent[]) => void;
}

const AudioStreamContext = createContext<AudioStreamContextProps | undefined>({
    liveEvents: [],
    setLiveEvents: () => {},
});   

export const AudioStreamContextProvider = ({ children }: AudioStreamContextProviderProps) => {
    const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);

    useEffect(() => {
        // Fetch live events from the server or any other source
        const fetchLiveEvents = async () => {
            const fetchedLiveEvents: LiveEvent[] = await getTopTenLiveEvents();
            setLiveEvents(fetchedLiveEvents);
        };

        fetchLiveEvents();
    }, []);
    const contextData = {
        liveEvents,
        setLiveEvents,
    }

    return (
        <AudioStreamContext.Provider value={contextData}>
            {children}
        </AudioStreamContext.Provider>
    );
};

export const useAudioStreamContext = () => {
    const context = useContext(AudioStreamContext);
    if (!context) {
        throw new Error("useAudioStreamContext must be used within an AudioStreamContextProvider");
    }
    return context;
}