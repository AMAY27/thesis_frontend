import React from 'react'
import "./AlertCard.css"
import { MdOutlineEditCalendar } from "react-icons/md";
import {AlertProps} from '../types';


const AlertCard: React.FC<AlertProps> = ({title, start_date, end_date, start_time, end_time}) => {
  return (
    <div className='alertcard'>
      <h3>{title}</h3>
      <h4>{start_date.split('T')[0]} - {end_date.split('T')[0]}</h4>
      <h4>{start_time} - {end_time}</h4>
      <h4><MdOutlineEditCalendar/></h4>
    </div>
  )
}

export default AlertCard