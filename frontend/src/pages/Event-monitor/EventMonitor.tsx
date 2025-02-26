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
    const [activeHourforData, setActiveHourforData] = useState<keyof EventsMonitorData>("oneHour");
    const [selectedClass, setSelectedClass] = useState<string[]>(["Zerbrechen"]);

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

    if (clickedNavItem !== "eventsmonitor") {
        return null;
    }
  return (
    <div className="events-monitor">
        <div className="events-class-selector">
            <select name='classname' onChange={handleChange} required>
                <option value="Zerbrechen">Zerbrechen</option>
                <option value="Türklingel">Türklingel</option>
                <option value="Klingelton">Klingelton</option>
                <option value="Ruhe">Ruhe</option>
                <option value="ZwitscherndeVögel">ZwitscherndeVögel</option>
                <option value="Schnarchen">Schnarchen</option>
                <option value="Wind">Wind</option>
                <option value="Sirene">Sirene</option>
            </select>
            <div className="selected-class-list">
                {selectedClass.map((item) => (
                    <div key={item} className="selected-class-item">
                        <p>{item}</p>
                        <p onClick={() => handleSelectedClassDelete(item)}>x</p>
                    </div>
                ))}
            </div>
        </div>
        {/* <h2>Events Monitor</h2> */}
        {/* <div className="em-left-container">
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
                    className={`${activeHourforData === "twentyFourHour" ? 'em-btn-div-active' : ''}`}
                    onClick={() => setActiveHourforData("twentyFourHour")}
                >
                    24 Hrs
                </button>
            </div>
            <div className="em-data-div">
                {eventsMonitorData && eventsMonitorData[0] && (
                    (eventsMonitorData[0][activeHourforData] ? eventsMonitorData[0][activeHourforData].map((item: any) => (
                        <div key={item._id} className="em-data-card">
                            <p>{item._id}</p>
                            <p>{item.count}</p>
                        </div>
                    )) : 
                        <div>
                            <h2>No data for last twelve hours</h2>
                        </div>
                    )
                )}
            </div>
        </div> */}
    </div>
  )
}

export default hoc(EventMonitor)