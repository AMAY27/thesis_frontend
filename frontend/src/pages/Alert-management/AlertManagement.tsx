// import React from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import AlertCard from "./components/AlertCard";
// import { getAlerts } from "./api.services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {AddAlertProps, AlertCalendarProps} from "./types";
import GlobalForm from "../../components/Forms/GlobalForm";
import './AlertManagement.css'
import notification from "../../axios/notification";
import { saveAlert, getAlerts } from "./indexDBServices";

const AlertManagement = () => {
  const { clickedNavItem } = useNavContext();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertCalendarProps[]>([]);
  const [addAlertClicked, setAddAlertClicked] = useState<Boolean>(false);
  const [updateAlertClicked, setUpdateAlertClicked] = useState<Boolean>(false);
  const [mobileAlertClicked, setMobileAlertClicked] = useState<Boolean>(false);
  const [isMobile, setIsMobile] = useState<Boolean>(false);
  const [alertType, setAlertType] = useState<string>("active");
  const [updateAlert, setUpdateAlert] = useState<AddAlertProps>();

  const fetchAlerts = async() => {
    const resp = await getAlerts();
    console.log(resp);
    const alertsWithHandler = resp.map((alert) => ({
      ...alert,
      handleAlertCalendarClicked: handleAlertCalendarClicked,
      handleAlertUpdateClicked: () => handleAlertUpdateClicked(alert),
    }));
    setAlerts(alertsWithHandler);
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setAlertType(value);
  }

  const handleAddAlertClicked = () => {
    // localStorage.setItem("alert_details", )
    setAddAlertClicked(!addAlertClicked);
    setMobileAlertClicked(false);
  }

  const handleMobileAlertCLicked = () => {
    setMobileAlertClicked(!mobileAlertClicked);
  }

  const handleAlertCalendarClicked = () => {
    navigate("/alert/calendar");
  }

  const handleCancelClicked = () => {
    setMobileAlertClicked(false);
    setAddAlertClicked(false);
    setUpdateAlertClicked(false);
  }

  const handleAlertUpdateClicked = ({user_id,title,classname,start_date,end_date,start_time,end_time,status,alert_type,createdAt}: AddAlertProps) => {
    setUpdateAlertClicked(true);
    const alertDetails: AddAlertProps = {
      user_id,
      title,
      classname,
      start_date,
      end_date,
      start_time,
      end_time,
      status,
      alert_type,
      createdAt
    };
    setUpdateAlert(alertDetails);
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

  const handleSubmit = async (alertDetails: AddAlertProps) => {
    try {
        
        // await addAlert("/alert/create", alertData);
        await saveAlert(alertDetails);
        notification("Alert added successfully!", "success");
        fetchAlerts();
    } catch (error) {
        // Error handling is already done in addAlert
    } 
  }
  
  // const handleUpdateSubmit = async (alertDetails: BaseEventProps) => {
  //   try {
  //       const alertData: AddAlertProps = {
  //         ...alertDetails,
  //         alert_type: updateAlert?.alert_type || alertType,
  //         createdAt: Date.now()
  //       }
  //       // await addAlert("/alert/update", alertData);
  //       await saveAlert(alertData);
  //       notification("Alert updated successfully!", "success");
  //       fetchAlerts();
    
  //   } catch (error) {
  //       // Error handling is already done in addAlert
  //   } 
  // }

  // if (addAlertClicked) {
  //   return <AlertCreationForm handleCloseAlertCLicked={handleAddAlertClicked}/>;
  // }

  return (
    <div className={`alert-manager`}>
      {addAlertClicked && 
        <div className="form-overlay">
          <GlobalForm onSubmit={handleSubmit} handleCancelClicked={handleCancelClicked}>
            <div className="input-div">
              <label htmlFor="alert_type">Alert Type</label>
              <select name="alert_type" onChange={handleChange} value={alertType} required>
                <option value="active">
                  Triggered when event is detected
                </option>
                <option value="inactive">
                  Triggered when event is not detected
                </option>
              </select>
            </div>
          </GlobalForm>
        </div>
      }
      {updateAlertClicked && 
        <div className="form-overlay">
          <GlobalForm onSubmit={handleSubmit} handleCancelClicked={handleCancelClicked} initialValues={updateAlert}>
            <div className="input-div">
              <label htmlFor="alert_type">Alert Type</label>
              <select name="alert_type" onChange={handleChange} value={alertType} required>
                <option value="active">
                  Triggered when event is detected
                </option>
                <option value="inactive">
                  Triggered when event is not detected
                </option>
              </select>
            </div>
          </GlobalForm>
        </div>
      }
      {mobileAlertClicked ? 
        <GlobalForm onSubmit={handleSubmit} handleCancelClicked={handleCancelClicked}>
          <div className='input-div'>
              <label htmlFor="alert_type">Alert Type</label>
              <select name="alert_type" onChange={handleChange} value={alertType} required>
                  <option value="active">
                      {/* <h5>On Detection</h5> */}
                      Triggered when event is detected
                  </option>
                  <option value="inactive">
                      {/* <h5>On Non-detection</h5> */}
                      Triggered when event is not detected
                  </option>
              </select>
          </div>
      </GlobalForm> : 
      <div className="left-container">
        <table className="alert-table">
        {!isMobile && <colgroup>
          <col style={{ width: '20%', fontWeight: 'bolder' }} />
          <col style={{ width: '40%' }} />
          <col style={{ width: '25%' }} />
          <col style={{ width: '15%' }} />
        </colgroup>}
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
        {/* {addAlertClicked && 
          // <AlertCreationForm handleCloseAlertCLicked={handleAddAlertClicked} refetchAlerts={fetchAlerts}/>
          <GlobalForm onSubmit={handleSubmit}>
            <div className='input-div'>
                <label htmlFor="alert_type">Alert Type</label>
                <select name="alert_type" onChange={handleChange} value={alertType} required>
                    <option value="active">
                        Triggered when event is detected
                    </option>
                    <option value="inactive">
                        Triggered when event is not detected
                    </option>
                </select>
            </div>
          </GlobalForm>
        } */}
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