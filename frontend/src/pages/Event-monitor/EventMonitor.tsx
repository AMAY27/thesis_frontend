// import React from 'react'

import { useEffect, useState } from "react"
import { EventsMonitorData } from "./types"
import { getEventsMonitorData } from "./api.service";
import { useNavContext } from "../../global-context/NavContext";
import hoc from "../../hoc/hoc";

const EventMonitor = () => {
    const { clickedNavItem } = useNavContext();
    const [eventsMonitorData, setEventsMonitorData] = useState<EventsMonitorData>();
    useEffect(() => {
        const fetchData = async () => {
            const resp:EventsMonitorData = await getEventsMonitorData("/custom-events/getEventsMonitorData")
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
    <div>EventMonitor</div>
  )
}

export default hoc(EventMonitor)