import React from 'react'
import { EventsMonitorData } from '../../Event-monitor/types';

interface MobileFilterProps {
    selectedClass: string[];
    activeHourforData: keyof EventsMonitorData;
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSelectedClassDelete: (classname:string) => void;
    setActiveHourforData: (hour: keyof EventsMonitorData) => void;
}
const MobileFilter:React.FC<MobileFilterProps> = ({ activeHourforData,setActiveHourforData}) => {
    // const events = ['AlaramClock', 'Blending', 'Breaking','Canopening','Cat', 'Chirpingbirds', 'Clapping', 'Clarinet', 'Clocktick', 'Crying', 'Cupboard', 'Displaying_furniture', 'Dog', 'DoorBell','Dragonground','Drill','Drinking', 'Drum', 'Femalespeaking', 'Flute', 'Glass', 'Guitar', 'Hairdryer', 'Covidcough', 'Help', 'Hen', 'Hihat', 'Hit', 'Jackhammer', 'Keyboardtyping', 'Kissing','Laughing', 'Lighter', 'Healthycough', 'Manspeaking', 'Metal-on-metal', 'Astmacough', 'Mouseclick', 'Ringtone', 'Rooster', 'Silence', 'Sitar', 'Sneezing', 'Snooring', 'Stapler', 'ToiletFlush','Toothbrush','Trampler', 'Vaccumcleaner', 'Vandalism', 'WalkFootsteps', 'Washingmachine', 'Water', 'Whimper', 'Window', 'HandSaw', 'Siren', 'Whistling','Wind']

  return (
    <div>
        {/* <div className="events-class-selector">
            <select name='classname' onChange={handleChange} required>
                {events.map((event) => (
                    <option key={event} value={event}>{event}</option>
                ))}
            </select>
            <div className="selected-class-list">
                {selectedClass.map((item) => (
                    <div key={item} className="selected-class-item">
                        <p>{item}</p>
                        <p onClick={() => handleSelectedClassDelete(item)}>x</p>
                    </div>
                ))}
            </div>
        </div> */}
        <div className="em-btn-div">
            <button 
                className={`${activeHourforData === "all" ? 'em-btn-div-active' : ''}`}
                onClick={() => setActiveHourforData("all")}
            >
                All
            </button>
            <button 
                className={`${activeHourforData === "fiveMinutes" ? 'em-btn-div-active' : ''}`}
                onClick={() => setActiveHourforData("fiveMinutes")}
            >
                5 Mins
            </button>
            <button 
                className={`${activeHourforData === "fifteenMinutes" ? 'em-btn-div-active' : ''}`}
                onClick={() => setActiveHourforData("fifteenMinutes")}
            >
                15 Mins
            </button>
            <button 
                className={`${activeHourforData === "thirtyMinutes" ? 'em-btn-div-active' : ''}`}
                onClick={() => setActiveHourforData("thirtyMinutes")}
            >
                30 Mins
            </button>
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
            <button 
                className={`${activeHourforData === "yesterday" ? 'em-btn-div-active' : ''}`}
                onClick={() => setActiveHourforData("yesterday")}
            >
                Yesterday
            </button>
            <button 
                className={`${activeHourforData === "dayBeforeYesterday" ? 'em-btn-div-active' : ''}`}
                onClick={() => setActiveHourforData("dayBeforeYesterday")}
            >
                Day Before Yesterday
            </button>
        </div>
    </div>
  )
}

export default MobileFilter