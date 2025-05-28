import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { LiveEvent } from "../types";
import { getTopTenLiveEvents } from "../indexDBServices";
import { EventsMonitorData } from "../../Event-monitor/types";

interface AudioStreamContextProviderProps {
    children: ReactNode;
}

interface AudioStreamContextProps {
    liveEvents: LiveEvent[];
    setLiveEvents: (liveEvents: LiveEvent[]) => void;
    eventsMonitorData: EventsMonitorData[];
    setEventsMonitorData: (eventsMonitorData: EventsMonitorData[]) => void;
    eventLogs: LiveEvent[];
    setEventLogs: (eventLogs: LiveEvent[]) => void;
}

const AudioStreamContext = createContext<AudioStreamContextProps | undefined>({
    liveEvents: [],
    setLiveEvents: () => {},
    eventsMonitorData: [],
    setEventsMonitorData: () => {},
    eventLogs: [],
    setEventLogs: () => {},
});   

export const AudioStreamContextProvider = ({ children }: AudioStreamContextProviderProps) => {
    const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
    const [eventsMonitorData, setEventsMonitorData] = useState<EventsMonitorData[]>([]);
    const [eventLogs, setEventLogs] = useState<LiveEvent[]>([]);

    useEffect(() => {
        // Fetch live events from the server or any other source
        const fetchLiveEvents = async () => {
            const fetchedLiveEvents: LiveEvent[] = [];
            setLiveEvents(fetchedLiveEvents);
            const fetchedEventsMonitorData: EventsMonitorData[] = [];
            setEventsMonitorData(fetchedEventsMonitorData);
            const fetchedEventLogs: LiveEvent[] = await getTopTenLiveEvents();
            setEventLogs(fetchedEventLogs);
        };

        fetchLiveEvents();
    }, []);
    const contextData = {
        liveEvents,
        setLiveEvents,
        eventsMonitorData,
        setEventsMonitorData,
        eventLogs,
        setEventLogs,
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