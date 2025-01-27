// import React from 'react'
import './AlertCalendar.css'
import hoc from '../../../hoc/hoc';
import { useEffect, useState } from 'react';

const AlertCalendar = () => {
    const [nav, setNav] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const dt = new Date();
        dt.setMonth(dt.getMonth() + nav);
        setCurrentDate(dt);
    }, [nav]);

    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dt = currentDate
    const today = new Date().getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  return (
    <div id="container">
        <div id="header">
            <div id="month-display">{dt.toLocaleDateString('en-US', {month : 'long'})} ${year}</div>
            <div>
                <button id="prevButton" onClick={() => setNav(nav - 1)}>Prev</button>
                <button id="nextButton" onClick={() => setNav(nav + 1)}>Next</button>
            </div>
        </div>
        <div id="weekdays">
            <div>Sunday</div>
            <div>Monday</div>
            <div>Tueday</div>
            <div>Wednesday</div>
            <div>Thursday</div>
            <div>Friday</div>
            <div>Saturday</div>
        </div>
        <div id="calendar">
            { [...Array(paddingDays + daysInMonth).keys()].map((day) => {
                const dayNumber = day - paddingDays + 1;
                if(day >= paddingDays){
                    if (dayNumber === today && nav === 0){ 
                        return <div key={day} className="day" id="currentDay">{day - paddingDays}</div>
                    }
                    else {
                        return <div key={day} className="day">{dayNumber}</div>;
                    }
                } else {
                    return <div className="padding"></div>
                }
            })}
        </div>
    </div>
  )
}

export default hoc(AlertCalendar)