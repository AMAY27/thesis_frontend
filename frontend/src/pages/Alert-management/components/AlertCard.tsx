import React from 'react';
import './AlertCard.css';
// import { MdOutlineEditCalendar } from "react-icons/md";
import { AlertCalendarProps } from '../types';

const AlertCard: React.FC<AlertCalendarProps> = ({
  title,
  start_date,
  end_date,
  start_time,
  end_time,
  classname,
  handleAlertUpdateClicked,
  handleDeleteAlertClicked,
}) => {
  return (
    <div className="alert-card">
      <div className="alert-card-left">
        <h3 className="alert-title">{title}</h3>
        <p className="alert-sound">{classname}</p>

        <div className="alert-dates">
          <span>{start_date} to {end_date}</span>
        </div>

        <div className="alert-time">
          <span>{start_time} – {end_time}</span>
        </div>
      </div>

      <div className="alert-card-actions">
        <button className="alert-btn edit" onClick={handleAlertUpdateClicked}>
          Edit
        </button>
        <button className="alert-btn delete" onClick={handleDeleteAlertClicked}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default AlertCard;
