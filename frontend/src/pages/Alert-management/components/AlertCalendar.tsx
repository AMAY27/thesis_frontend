// import React from 'react'
import './AlertCalendar.css'
import hoc from '../../../hoc/hoc';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { getAlertLogs } from '../api.services';
import { AlertLogsProps } from '../types';
import AlertUpdateCard from './AlertUpdateCard';

const AlertCalendar = () => {

    const [alertLogs, setAlertLogs] = useState<AlertLogsProps[]>([]);

    useEffect(() => {
        const fetchAlertLogs = async() => {
            const resp:AlertLogsProps[] = await getAlertLogs("/alert/alert-logs", "677fc94ae64c5fb4d0273895");
            setAlertLogs(resp);
        }
        fetchAlertLogs();
    },[]);

    useEffect(() => {
        console.log(alertLogs);
    }, [alertLogs]);

    const [nav, setNav] = useState(0);

    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dt = new Date();
    const currentMonth = new Date(dt.getFullYear(), dt.getMonth() + nav, 1);
    const today = new Date().getDate();
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    const formatDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

  return (
    <div>
    <div id="container">
        <div id="header">
            {/* <div>Calendar Timeline</div> */}
            <div id="month-display">{currentMonth.toLocaleDateString('en-US', {month : 'long'})} {year}</div>
            <div>
                <button id="prevButton" onClick={() => setNav(nav - 1)}>Prev</button>
                <button id="nextButton" onClick={() => setNav(nav + 1)}>Next</button>
            </div>
        </div>
        <div id="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
        </div>
        <div id="calendar">
            { [...Array(paddingDays + daysInMonth).keys()].map((day) => {
                const dayNumber = day - paddingDays + 1;
                const dayString = formatDateString(new Date(year, month, dayNumber));
                const isTriggeredDay = alertLogs.some(alertLog => alertLog.triggerDate.split('T')[0] === dayString);
                const tooltipId = `tooltip-${dayString}`;

                if(day >= paddingDays){
                    if (dayNumber === today && nav === 0){ 
                        return( 
                            <div key={day} className={`day ${isTriggeredDay ? 'highlight' : ''}`} id="currentDay" data-tooltip-id={tooltipId}>
                                {dayNumber}
                                <Tooltip id={tooltipId} content={dayString} place="top"/>
                            </div>
                        )
                    }
                    else {
                        return( 
                          <div key={day} className={`day ${isTriggeredDay ? 'highlight' : ''}`} data-tooltip-id={tooltipId}>
                              {dayNumber}
                              <Tooltip id={tooltipId} content={dayString} place="top" />
                          </div>
                        )
                    }
                } else {
                    return <div className="padding"></div>
                }
            })}
        </div>
    </div>
    <div>
    </div>
    </div>
  )
}

export default hoc(AlertCalendar)