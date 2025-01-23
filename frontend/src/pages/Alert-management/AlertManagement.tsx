// import React from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import AlertCard from "./components/AlertCard";
import { getAlerts } from "./api.services";
import { useEffect, useState } from "react";
import {AlertProps} from "./types";
import './AlertManagement.css'
import AlertCreationForm from "./components/AlertCreationForm";

const AlertManagement = () => {
  const { clickedNavItem } = useNavContext();
  const [alerts, setAlerts] = useState<AlertProps[]>([]);
  const [addAlertClicked, setAddAlertClicked] = useState<Boolean>(false);

  const fetchAlerts = async() => {
    const resp = await getAlerts<AlertProps[]>("/alert/alerts");
    console.log(resp);
    setAlerts(resp);
  }

  const handleAddAlertClicked = () => {
    setAddAlertClicked(!addAlertClicked);
  }

  useEffect(() => {
    fetchAlerts();
  },[]);

  if (clickedNavItem !== "alerts") {
    return null;
  }

  // if (addAlertClicked) {
  //   return <AlertCreationForm handleCloseAlertCLicked={handleAddAlertClicked}/>;
  // }

  return (
    <div className={`alert-manager`}>
      <div className="left-container">
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
      <div className="right-container">
        <div className="btn-div">
          <button onClick={handleAddAlertClicked}>Add Alert</button>
        </div>
        {addAlertClicked && <AlertCreationForm handleCloseAlertCLicked={handleAddAlertClicked}/>}
        <div className="notification-div">
          <h2 style={{color: "#62B2C0"}}>
            Alert Notifications
          </h2>
          <p>There are no notifications at the moment</p>
        </div>
      </div>
    </div>
  )
}

export default hoc(AlertManagement);