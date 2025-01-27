// import React from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import AlertCard from "./components/AlertCard";
import { getAlerts } from "./api.services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {AlertCalendarProps} from "./types";
import './AlertManagement.css'
import AlertCreationForm from "./components/AlertCreationForm";

const AlertManagement = () => {
  const { clickedNavItem } = useNavContext();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertCalendarProps[]>([]);
  const [addAlertClicked, setAddAlertClicked] = useState<Boolean>(false);
  const [mobileAlertClicked, setMobileAlertClicked] = useState<Boolean>(false);
  const [isMobile, setIsMobile] = useState<Boolean>(false);

  const fetchAlerts = async() => {
    const resp = await getAlerts<AlertCalendarProps[]>("/alert/alerts");
    console.log(resp);
    const alertsWithHandler = resp.map(alert => ({
      ...alert,
      handleAlertCalendarClicked: handleAlertCalendarClicked
    }));
    setAlerts(alertsWithHandler);
  }

  const handleAddAlertClicked = () => {
    setAddAlertClicked(!addAlertClicked);
    setMobileAlertClicked(false);
  }

  const handleMobileAlertCLicked = () => {
    setMobileAlertClicked(!mobileAlertClicked);
  }

  const handleAlertCalendarClicked = () => {
    navigate("/alert/calendar");
  }

  useEffect(() => {
    fetchAlerts();
  },[]);

  
  useEffect(() => {
      const handleResize = () => {
          setIsMobile(window.innerWidth <= 1000);
          setMobileAlertClicked(window.innerWidth <= 1000 ? mobileAlertClicked : false);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, [])
  

  if (clickedNavItem !== "alerts") {
    return null;
  }

  // if (addAlertClicked) {
  //   return <AlertCreationForm handleCloseAlertCLicked={handleAddAlertClicked}/>;
  // }

  return (
    <div className={`alert-manager`}>
      {mobileAlertClicked ? <AlertCreationForm handleCloseAlertCLicked={handleMobileAlertCLicked} refetchAlerts={fetchAlerts}/> : 
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

      </div>}
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
      {isMobile && <button className={`alert-add-btn ${mobileAlertClicked ? 'alert-btn-disabled' : ''}` } onClick={handleMobileAlertCLicked}>+</button>}
    </div>
  )
}

export default hoc(AlertManagement);