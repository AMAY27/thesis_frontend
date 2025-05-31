import React from 'react'
import "./AlertCard.css"
// import { MdOutlineEditCalendar } from "react-icons/md";
import {AlertCalendarProps} from '../types';


const AlertCard: React.FC<AlertCalendarProps> = ({title, start_date, end_date, start_time, end_time,classname, handleAlertUpdateClicked, handleDeleteAlertClicked}) => {
  return (
      <tr className='alertcard'>
        <td style={{ fontWeight: "bold", color:"#62B2C0" }}>{title}</td>
        <td>{classname}</td>
        <td>{start_date.split('T')[0]} - {end_date.split('T')[0]}</td>
        <td>{start_time} - {end_time}</td>
        {/* <td onClick={handleAlertCalendarClicked}><MdOutlineEditCalendar/></td> */}
        <td><button onClick={handleAlertUpdateClicked}>Edit</button></td>
        <td><button onClick={handleDeleteAlertClicked}>delete</button></td>
      </tr>
  )
}

export default AlertCard