// import React from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import AlertCard from "./components/AlertCard";
import { getAlerts } from "./api.services";
import { useEffect, useState } from "react";
import {AlertProps} from "./types";
import './AlertManagement.css'

const AlertManagement = () => {
  const { clickedNavItem } = useNavContext();
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const fetchAlerts = async() => {
    const resp = await getAlerts<AlertProps[]>("/alert/alerts");
    console.log(resp);
    setAlerts(resp);
  }

  useEffect(() => {
    fetchAlerts();
  },[]);

  if (clickedNavItem !== "alerts") {
    return null;
  }
  return (
    <div
      style={{
        marginLeft: "4rem"
      }}
    >
      {/* <AlertCard 
        title="Alert 1" 
        time_range={{start_time: "10:00 am", end_time: "11:00 am"}} 
        date_range={{start_date: "01 Jan 2021", end_date: "01 Feb 2021"}} 
        createdAt="2021-01-01" 
        classname="Ruhe" 
        alertType="active"
        status="active"
      /> */}
      <div className="btn-div">
        <button>Add Alert</button>
      </div>
      {
        alerts.map((alert, index) => (
          <AlertCard 
            key={index}
            user_id={alert.user_id}
            title={alert.title} 
            classname={alert.classname}
            alert_type={alert.alert_type}
            start_date={alert.start_date}
            end_date={alert.end_date}
            start_time={alert.start_time}
            end_time={alert.end_time}
            createdAt={alert.createdAt} 
            status={alert.status}
          />
        ))
      }
    </div>
  )
}

export default hoc(AlertManagement);