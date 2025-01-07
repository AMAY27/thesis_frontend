// import React from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import AlertCard from "./components/AlertCard";
import { getAlerts } from "./api.services";
import { useEffect, useState } from "react";

const AlertManagement = () => {
  const { clickedNavItem } = useNavContext();
  const [alerts, setAlerts] = useState<any[]>([]);

  const fetchAlerts = async() => {
    const resp = await getAlerts("/alert/alerts");
    console.log(resp);
    // setAlerts(resp);
  }

  useEffect(() => {
    fetchAlerts();
  },[])

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
        timeRange={{start_time: "10:00 am", end_time: "11:00 am"}} 
        dateRange={{start_date: "01 Jan 2021", end_date: "01 Feb 2021"}} 
        createdAt="2021-01-01" 
        classname="Ruhe" 
        alertType="active"
      />
    </div>
  )
}

export default hoc(AlertManagement);