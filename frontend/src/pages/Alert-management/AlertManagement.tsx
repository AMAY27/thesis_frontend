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
        <table className="alert-table">
        <colgroup>
          <col style={{ width: '20%', fontWeight: 'bolder' }} />
          <col style={{ width: '40%' }} />
          <col style={{ width: '25%' }} />
          <col style={{ width: '15%' }} />
        </colgroup>
          <tbody>
          {
              alerts.map((alert, index) => (
                <AlertCard 
                  key={index}
                  {...alert}
                />
              ))
          }
          </tbody>
        </table>

      </div>
      <div className="right-container">
        <div className="btn-div">
          <button onClick={handleAddAlertClicked}>Add Alert</button>
        </div>
        {addAlertClicked && <AlertCreationForm handleCloseAlertCLicked={handleAddAlertClicked} refetchAlerts={fetchAlerts}/>}
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