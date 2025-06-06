// import React from 'react'

import { useEffect, useState } from "react"
import { EventsMonitorData } from "./types"
import EventMonitorBarChart from "./components/EventMonitorBarChart";
import { SoundCount } from "./types";
import './EventMonitor.css';
import MobileFilter from "../Event-Tracking/components/MobileFilter";
import { useAudioStreamContext } from '../Audio-streaming/context/AudioStreamContext';
import {liveStreamService} from '../Audio-streaming/liveStreamingService';
import { getEventsMonitoringData, getAllLiveEvents } from '../Audio-streaming/indexDBServices';



const EventMonitor = () => {

    const timeRanges = [
      "fiveMinutes",
      "fifteenMinutes",
      "thirtyMinutes",
      "oneHour",
      "threeHour",
      "sixHour",
      "twelveHour",
      "twentyFourHour",
      "yesterday",
      "dayBeforeYesterday",
      "all"
    ];

    const readableLabels: Record<string, string> = {
      all: "All Time",
      fiveMinutes: "Last 5 Minutes",
      fifteenMinutes: "Last 15 Minutes",
      thirtyMinutes: "Last 30 Minutes",
      oneHour: "Last 1 Hour",
      threeHour: "Last 3 Hours",
      sixHour: "Last 6 Hours",
      twelveHour: "Last 12 Hours",
      twentyFourHour: "Last 24 Hours",
      yesterday: "Yesterday",
      dayBeforeYesterday: "Day Before Yesterday"
    };
    const {eventsMonitorData, setEventsMonitorData} = useAudioStreamContext();
    const [activeHourforData, setActiveHourforData] = useState<keyof EventsMonitorData>("all");
    const [selectedClass, setSelectedClass] = useState<string[]>([]);
    const [barChartData, setBarChartData] = useState<SoundCount[]>([]); 
    const [toggleView, setToggleView] = useState<string>("data");
    const {eventLogs, setEventLogs} = useAudioStreamContext();

    useEffect(() => {
        liveStreamService.setLiveEventsMonitoringDataUpdateHandler(setEventsMonitorData);
        liveStreamService.setLiveEventLogsHandler(setEventLogs);
        (async () => {
          try {
             const initialData = await getEventsMonitoringData();
             const initialEventLogs = await getAllLiveEvents();
             setEventLogs(initialEventLogs);
             setEventsMonitorData(initialData);
          } catch (error) {
             console.error("Failed to load initial events monitoring data", error);
          }
        })();
        
            // Filter data based on selectedClass if necessary
            // const filteredData = rawData.filter((item: any) =>
            //   selectedClass.includes(item._id)
            // );
    },[setEventsMonitorData, setEventLogs]);


    useEffect(() => {
        if (eventsMonitorData && eventsMonitorData.length > 0) {
            const rawData = eventsMonitorData[0][activeHourforData] || [];
            console.log("Raw Data:", rawData);
            // Filter data based on selectedClass if necessary
            setBarChartData(rawData);
        }
    }, [eventsMonitorData, activeHourforData, selectedClass]);



    useEffect(() => {
        liveStreamService.setLiveEventsMonitoringDataUpdateHandler(setEventsMonitorData);
        liveStreamService.setLiveEventLogsHandler(setEventLogs);
    },[])

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

    const handleActiveHourChange = (rangeKey: keyof EventsMonitorData) => {
        setActiveHourforData(rangeKey);
        // Update bar chart data based on the selected time range
    }

    useEffect(() => {
        const rawData = eventsMonitorData && eventsMonitorData[0] ? eventsMonitorData[0][activeHourforData] || [] : [];
            // Filter data based on selectedClass if necessary
        // const filteredData = rawData.filter((item: any) =>
        //   selectedClass.includes(item._id)
        // );
        setBarChartData(rawData);
    }, [activeHourforData, selectedClass])

  return (
    <div className="events-monitor">
        <div className="view-selector-parent">
            <div 
                onClick={() => setToggleView("data")} 
                className={`view-selector ${toggleView === "data" ? "active-selector" : ""}`}
            >
                Data View
            </div>
            <div
                onClick={() => setToggleView("graph")} 
                className={`view-selector ${toggleView === "graph" ? "active-selector" : ""}`}
            >
                Graph View
            </div>
            <div
                onClick={() => setToggleView("logs")} 
                className={`view-selector ${toggleView === "logs" ? "active-selector" : ""}`}
            >
                Event Logs
            </div>
        </div>
        { toggleView==="data" ? (
            <div className="data-view">
                {/* {eventsMonitorData && eventsMonitorData.map((item, idx) => (
                    <div key={idx}>
                        {JSON.stringify(item)}
                    </div>
                ))} */}
                <select name="" id="" onChange={(e) => handleActiveHourChange(e.target.value as keyof EventsMonitorData)}>
                    {timeRanges.map((rangeKey) => (
                        <option 
                            key={rangeKey} 
                            value={rangeKey}
                        >
                            {readableLabels[rangeKey]}
                        </option>
                    ))}
                </select>
                <div>
                    {eventsMonitorData && eventsMonitorData?.[0]?.[activeHourforData].length > 0 ? (
                        <div>
                            {eventsMonitorData[0][activeHourforData].map((event: SoundCount, index: number) => (
                                <div key={index} className="event-item">
                                    <span className="event-class-name">{event._id}</span>
                                    <span className="event-count">Count: {event.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-data">No Data Available</div>
                    )}
                </div>
                {/* {timeRanges.map((rangeKey) => {
                    const events = eventsMonitorData?.[0]?.[rangeKey as keyof EventsMonitorData];
                    return (
                      events && events.length > 0 && (
                        <>
                            <div className="time-range-heading">{readableLabels[rangeKey]}</div>
                            <div key={rangeKey} className="time-range-section">
                              {events.map((event: SoundCount, index: number) => (
                                <div key={index} className="event-item">
                                  <span className="event-class-name">{event._id}</span>
                                  <span className="event-count">Count: {event.count}</span>
                                </div>
                              ))}
                            </div>
                        </>
                      )
                    );
                })} */}
            </div>
        ) : toggleView==="graph" ? (
        <div className="graph-view">
            <MobileFilter
                activeHourforData={activeHourforData}
                setActiveHourforData={setActiveHourforData}
                selectedClass={selectedClass}
                handleChange={handleChange}
                handleSelectedClassDelete={handleSelectedClassDelete}
            />
            <div className="events-monitor-bar-chart">
                <EventMonitorBarChart data={barChartData} />
            </div>
        </div>
        ): (
            <div className="event-logs">
                <table id="event-logs-table">
                    
                    <tr className="event-table-headings">
                        <th>Class Name</th>
                        <th>Class Name (German)</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                    
                    {eventLogs.map((event, index) => (
                        <tr key={index}>
                            <td>{event.ClassName}</td>
                            <td>{event.ClassName_German}</td>
                            <td>{event.Datetime}</td>
                            <td>{event.Datetime_2}</td>
                        </tr>
                    ))}
                </table>
            </div>
        )}
    </div>
  )
}

export default EventMonitor