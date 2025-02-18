// import React from 'react'

import { useEffect, useState } from "react"
import { EventsMonitorData } from "./types"
import { getEventsMonitorData } from "./api.service";
import { useNavContext } from "../../global-context/NavContext";
import hoc from "../../hoc/hoc";
import ResponsiveHeatmap from "./components/ResponsiveHeatmap";
import './EventMonitor.css'

const EventMonitor = () => {
    const { clickedNavItem } = useNavContext();
    const [eventsMonitorData, setEventsMonitorData] = useState<EventsMonitorData[] | null>(null);
    const [activeHourforData, setActiveHourforData] = useState("oneHour");
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
    <div className="events-monitor">
        {/* <h2>Events Monitor</h2> */}
        <div className="em-left-container">
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
        <div className="em-right-container">
            <div className="em-btn-div">
                <button 
                    className={`${activeHourforData === "oneHour" ? 'em-btn-div-active' : ''}`}
                    onClick={() => setActiveHourforData("oneHour")}
                >
                    1 Hr
                </button>
                <button 
                    className={`${activeHourforData === "threeHour" ? 'em-btn-div-active' : ''}`}
                    onClick={() => setActiveHourforData("threeHour")}
                >
                    3 Hrs
                </button>
                <button 
                    className={`${activeHourforData === "sixHour" ? 'em-btn-div-active' : ''}`}
                    onClick={() => setActiveHourforData("sixHour")}
                >
                    6 Hrs
                </button>
                <button 
                    className={`${activeHourforData === "twelveHour" ? 'em-btn-div-active' : ''}`}
                    onClick={() => setActiveHourforData("twelveHour")}
                >
                    12 Hrs
                </button>
                <button 
                    className={`${activeHourforData === "twentyfourHour" ? 'em-btn-div-active' : ''}`}
                    onClick={() => setActiveHourforData("twentyfourHour")}
                >
                    24 Hrs
                </button>
            </div>
        </div>
    </div>
  )
}

export default hoc(EventMonitor)