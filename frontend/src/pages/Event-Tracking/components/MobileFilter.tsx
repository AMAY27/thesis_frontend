import React from 'react'
import { EventsMonitorData } from '../../Event-monitor/types';

interface MobileFilterProps {
    selectedClass: string[];
    activeHourforData: keyof EventsMonitorData;
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSelectedClassDelete: (classname:string) => void;
    setActiveHourforData: (hour: keyof EventsMonitorData) => void;
}
const MobileFilter:React.FC<MobileFilterProps> = ({selectedClass, activeHourforData,handleChange, handleSelectedClassDelete,setActiveHourforData}) => {
  return (
    <div>
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
        <div className="em-btn-div">
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