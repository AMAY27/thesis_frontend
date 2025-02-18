// import React from 'react'

import { useEffect, useState } from "react"
import { EventsMonitorData } from "./types"
import { getEventsMonitorData } from "./api.service";
import { useNavContext } from "../../global-context/NavContext";
import hoc from "../../hoc/hoc";
import ResponsiveHeatmap from "./components/ResponsiveHeatmap";

const EventMonitor = () => {
    const { clickedNavItem } = useNavContext();
    const [eventsMonitorData, setEventsMonitorData] = useState<EventsMonitorData[] | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const resp:EventsMonitorData[] = await getEventsMonitorData("/custom-events/getEventsMonitorData")
            setEventsMonitorData(resp);
        }
        fetchData();
    },[])
    useEffect(() => {
        console.log(eventsMonitorData);
    },[eventsMonitorData])

    if (clickedNavItem !== "eventsmonitor") {
        return null;
    }
  return (
    <div>
        <h2>Events Monitor</h2>
        {eventsMonitorData && (
            <ResponsiveHeatmap 
                oneHour={eventsMonitorData[0].oneHour || []}
                threeHour={eventsMonitorData[0].threeHour || []}
                sixHour={eventsMonitorData[0].sixHour || []}
                twelveHour={eventsMonitorData[0].twelveHour || []}
                twentyFourHour={eventsMonitorData[0].twentyFourHour || []}
            />
        )}
    </div>
  )
}

export default hoc(EventMonitor)