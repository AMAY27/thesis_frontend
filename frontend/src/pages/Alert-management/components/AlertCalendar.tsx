// import React from 'react'
import './AlertCalendar.css'
import hoc from '../../../hoc/hoc';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip'

const AlertCalendar = () => {
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

  return (
    <div id="container">
        <div id="header">
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
                const dayString = `${year}-${month + 1}-${dayNumber}`;
                if(day >= paddingDays){
                    if (dayNumber === today && nav === 0){ 
                        return( 
                            <>
                                <div key={day} className="day" id="currentDay">{dayNumber}</div>
                                <Tooltip id="tooltip" anchorSelect='.day' content={dayString} place="top"/>
                            </>
                        )
                    }
                    else {
                        return( 
                            <>
                                <div key={day} className="day">{dayNumber}</div>
                                <Tooltip id="tooltip" anchorSelect='.day' content={dayString} place="top"/>
                            </>
                        )
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