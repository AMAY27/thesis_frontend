// import React from 'react'

import { useEffect, useState } from "react"
import { EventsMonitorData } from "./types"
// import ResponsiveHeatmap from "./components/ResponsiveHeatmap";
import EventMonitorBarChart from "./components/EventMonitorBarChart";
import { SoundCount } from "./types";
import './EventMonitor.css';
import MobileFilter from "../Event-Tracking/components/MobileFilter";
import { getEventsMonitoringData } from "../Audio-streaming/indexDBServices";

const EventMonitor = () => {
    const [eventsMonitorData, setEventsMonitorData] = useState<EventsMonitorData[] | null>(null);
    const [activeHourforData, setActiveHourforData] = useState<keyof EventsMonitorData>("oneHour");
    const [selectedClass, setSelectedClass] = useState<string[]>([]);
    const [barChartData, setBarChartData] = useState<SoundCount[]>([]);
    // const [isMobile, setIsMobile] = useState<Boolean>(false);
// 

    useEffect(() => {
        const fetchData = async () => {
            const resp:EventsMonitorData[] = await getEventsMonitoringData();
            setEventsMonitorData(resp);
        }
        fetchData();
        if (eventsMonitorData && eventsMonitorData.length > 0) {
            // Get the raw data for the active hour (e.g., oneHour, threeHour, etc.)
            const rawData = eventsMonitorData[0][activeHourforData] || [];
            // Filter data based on selectedClass if necessary
            const filteredData = rawData.filter((item: any) =>
              selectedClass.includes(item._id)
            );
            setBarChartData(filteredData);
        }
    },[])
    useEffect(() => {
        console.log(barChartData);
    },[barChartData])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClass((prev) => {
            if(!prev.includes(e.target.value)) {
                return [...prev, e.target.value];
            }
            return prev;
        })
    }

    const handleSelectedClassDelete = (classname:string) => {
        setSelectedClass((prev) => {
            return prev.filter((item) => item !== classname);
        })
    } 

    useEffect(() => {
        const rawData = eventsMonitorData && eventsMonitorData[0] ? eventsMonitorData[0][activeHourforData] || [] : [];
            // Filter data based on selectedClass if necessary
        const filteredData = rawData.filter((item: any) =>
          selectedClass.includes(item._id)
        );
        setBarChartData(filteredData);
    }, [activeHourforData, selectedClass])

  return (
    <div className="events-monitor">
        <MobileFilter
            activeHourforData={activeHourforData}
            setActiveHourforData={setActiveHourforData}
            selectedClass={selectedClass}
            handleChange={handleChange}
            handleSelectedClassDelete={handleSelectedClassDelete}
        />
        <div>
            <EventMonitorBarChart data={barChartData} />
        </div>
    </div>
  )
}

export default EventMonitor