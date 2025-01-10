// import React from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import AlertCard from "./components/AlertCard";
import { getAlerts } from "./api.services";
import { useEffect, useState } from "react";
import AlertProps from "./types";

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
      <AlertCard 
        title="Alert 1" 
        time_range={{start_time: "10:00 am", end_time: "11:00 am"}} 
        date_range={{start_date: "01 Jan 2021", end_date: "01 Feb 2021"}} 
        createdAt="2021-01-01" 
        classname="Ruhe" 
        alertType="active"
        status="active"
      />
      {
        alerts.map((alert, index) => (
          <AlertCard 
            key={index}
            title={alert.title} 
            time_range={{start_time:alert.time_range.start_time, end_time:alert.time_range.end_time}} 
            date_range={{start_date:alert.date_range.start_date, end_date:alert.date_range.end_date}} 
            createdAt={alert.createdAt} 
            classname={alert.classname} 
            alertType={alert.alertType}
            status={alert.status}
          />
        ))
      }
    </div>
  )
}

export default hoc(AlertManagement);