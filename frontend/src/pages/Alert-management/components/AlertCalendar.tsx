// import React from 'react'
import './AlertCalendar.css'
import hoc from '../../../hoc/hoc';

const AlertCalendar = () => {


    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let nav = 0;


    const dt = new Date();
    if(nav !== 0){
        dt.setMonth(new Date().getMonth() + nav);
    }
    const today = dt.getDate();
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
                <button id="prevButton">Prev</button>
                <button id="nextButton">Next</button>
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
                    if(day > paddingDays){
                        if (day - paddingDays === today && nav === 0){ 
                            return <div className="day" id="currentDay">1</div>
                        }
                        return <div className="day">{day - paddingDays}</div>
                    } else {
                        return <div className="padding"></div>
                    }
                })}
            </div>
        </div>
    </div>
  )
}

export default hoc(AlertCalendar)