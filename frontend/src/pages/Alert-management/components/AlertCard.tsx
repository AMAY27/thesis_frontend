import React from 'react'
import "./AlertCard.css"
import { MdOutlineEditCalendar } from "react-icons/md";
import AlertProps from '../types';


const AlertCard: React.FC<AlertProps> = ({title, time_range, date_range}) => {
  return (
    <div className='alertcard'>
      <h3>{title}</h3>
      <h4>{date_range.start_date} - {date_range.end_date}</h4>
      <h4>{time_range.start_time} - {time_range.end_time}</h4>
      <h4><MdOutlineEditCalendar/></h4>
    </div>
  )
}

export default AlertCard