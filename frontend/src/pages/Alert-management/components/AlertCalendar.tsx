// import React from 'react'

const AlertCalendar = () => {


    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let nav = 0;


    const dt = new Date();
    if(nav !== 0){
        dt.setMonth(new Date().getMonth() + nav);
    }
    const day = dt.getDate();
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
                        return <div className="day">{day - paddingDays}</div>
                    } else {
                        return <div></div>
                    }
                })}
            </div>
        </div>
    </div>
  )
}

export default AlertCalendar