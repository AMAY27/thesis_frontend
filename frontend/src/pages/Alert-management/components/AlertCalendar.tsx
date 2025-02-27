// import React from 'react'
import './AlertCalendar.css'
import hoc from '../../../hoc/hoc';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { getAlertLogs } from '../api.services';
import { AlertLogsProps, CalendarProps, AlertProps } from '../types';

const AlertCalendar = () => {

    const [alertLogs, setAlertLogs] = useState<AlertLogsProps[]>([]);
    const [alertDetails, setAlertDetails] = useState<AlertProps>();
    const [isMobile, setIsMobile] = useState<Boolean>(false);

    useEffect(() => {
        const fetchAlertLogs = async() => {
            const resp:CalendarProps = await getAlertLogs("/alert/alert-logs", "677fc94ae64c5fb4d0273895");
            setAlertLogs(resp.alertLogs);
            setAlertDetails({
                user_id: resp.user_id,
                title: resp.title,
                classname: resp.classname,
                alert_type: resp.alert_type,
                start_date: resp.start_date,
                end_date: resp.end_date,
                start_time: resp.start_time,
                end_time: resp.end_time,
                status: resp.status,
                createdAt: resp.createdAt,
            })
        }
        fetchAlertLogs();
    },[]);

    useEffect(() => {
        const handleResize = () => { 
            setIsMobile(window.innerWidth <= 480);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
    <div className='alert-calendar'>
        <h3>Alert Calendar</h3>
        <div>
            <div className='custom-event-details-header' style={{display: 'flex', justifyContent: 'space-between',alignItems: 'center'}}>
                <h2>{alertDetails?.title}</h2>
                <button 
                    // onClick={() => setIsEditing(true)}
                    style={{backgroundColor: '#62B2C0', color: 'white', padding: '5px 10px', borderRadius: '5px'}}
                >Edit</button>
            </div>
            <div style={{marginBottom: '10px'}}>
                <label htmlFor='class' style={{color:'#62B2C0', fontWeight:'bold'}}>Class:</label> 
                <p style={{ margin:'5px'}} className='class'>{alertDetails?.classname}</p>
            </div>
            <div style={{marginBottom: '10px'}}>
                <label htmlFor='class' style={{color:'#62B2C0', fontWeight:'bold'}}>Date Range:</label> 
                <p style={{ margin:'5px'}} className='class'>{alertDetails?.start_date.split('T')[0]} to {alertDetails?.end_date.split('T')[0]}</p>
            </div>
            <div style={{marginBottom: '10px'}}>
                <label htmlFor='class' style={{color:'#62B2C0', fontWeight:'bold'}}>Time Range:</label> 
                <p style={{ margin:'5px'}} className='class'>{alertDetails?.start_time} - {alertDetails?.end_time}</p>
            </div>
        </div>
        <div id="container">
            <div id="header">
                {/* <div>Calendar Timeline</div> */}
                <div id="month-display">{currentMonth.toLocaleDateString('en-US', {month : 'long'})} {year}</div>
                <div>
                    <button id="prevButton" onClick={() => setNav(nav - 1)}>{isMobile ? "<" : "Prev"}</button>
                    <button id="nextButton" onClick={() => setNav(nav + 1)}>{isMobile ? ">" : "Next"}</button>
                </div>
            </div>
            <div id="weekdays">
                <div>{isMobile ? "S" : "Sun"}</div>
                <div>{isMobile ? "M" : "Mon"}</div>
                <div>{isMobile ? "T" : "Tue"}</div>
                <div>{isMobile ? "W" : "Wed"}</div>
                <div>{isMobile ? "T" : "Thu"}</div>
                <div>{isMobile ? "F" : "Fri"}</div>
                <div>{isMobile ? "S" : "Sat"}</div>
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
    </div>
  )
}

export default hoc(AlertCalendar)