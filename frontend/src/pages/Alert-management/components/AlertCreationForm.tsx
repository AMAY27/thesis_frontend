import React from 'react';
import './AlertCreationForm.css'
import { AddAlertProps } from '../types';
import { addAlert } from '../api.services';
import notification from '../../../axios/notification';

interface AlertCreationFormProps {
    handleCloseAlertCLicked: () => void;
    refetchAlerts: () => void;
}

const AlertCreationForm:React.FC<AlertCreationFormProps> = ({handleCloseAlertCLicked, refetchAlerts}) => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [alertDetails, setAlertDetails] = React.useState<AddAlertProps>({
        user_id: "676bdb353db50d80a5c8a82a",
        title: "",
        classname: "Zerbrechen",
        alert_type: "active",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        status: "active",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAlertDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }))
    }

    const handleSubmit = async (e:React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            await addAlert("/alert/create", alertDetails);
            notification("Alert added successfully!", "success");
            refetchAlerts();
            setAlertDetails({
                user_id: "676bdb353db50d80a5c8a82a",
                title: "",
                classname: "Zerbrechen",
                alert_type: "active",
                start_date: "",
                end_date: "",
                start_time: "",
                end_time: "",
                status: "active",
            });
        } catch (error) {
            // Error handling is already done in addAlert
        } finally {
            setIsLoading(false);
        }
        
    }
  return (
    <div className='alert-form-div'>
        {isLoading && <div className="loading-overlay"><div className="spinner"></div></div>}
        <form onSubmit={handleSubmit} className='alert-form'>
            <div className="input-row">
                <div className='input-div'>
                    <label htmlFor="">Title</label>
                    <input type="text" name="title" onChange={handleChange} required value={alertDetails.title}/>
                </div>
                <div className='input-div'>
                    <label htmlFor="classname">Class name</label>
                    <select name='classname' onChange={handleChange} value={alertDetails.classname} required>
                        <option value="Zerbrechen">Zerbrechen</option>
                        <option value="Türklingel">Türklingel</option>
                        <option value="Klingelton">Klingelton</option>
                        <option value="Ruhe">Ruhe</option>
                        <option value="ZwitscherndeVögel">ZwitscherndeVögel</option>
                        <option value="Schnarchen">Schnarchen</option>
                        <option value="Wind">Wind</option>
                        <option value="Sirene">Sirene</option>
                    </select>
                </div>
            </div>
            <div className='input-div'>
                <label htmlFor="alert_type">Alert Type</label>
                <select name="alert_type" onChange={handleChange} value={alertDetails.alert_type} required>
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
            <div className="input-row">
                <div className='input-div'>
                    <label htmlFor="start_date">Start Date</label>
                    <input type="date" name="start_date" onChange={handleChange} min="2018-01-01" max="2030-12-31" value={alertDetails.start_date} required/>
                </div>
                <div className='input-div'>
                    <label htmlFor="">End Date</label>
                    <input type="date" name="end_date" onChange={handleChange} min="2018-01-01" max="2030-12-31" value={alertDetails.end_date} required/>
                </div>
            </div>
            <div className="input-row">
                <div className='input-div'>
                    <label htmlFor="">Start Time</label>
                    <input type="time" name="start_time" onChange={handleChange} required value={alertDetails.start_time} />
                </div>
                <div className='input-div'>
                    <label htmlFor="">End Time</label>
                    <input type="time" name="end_time" onChange={handleChange} required value={alertDetails.end_time} />
                </div>
            </div>
            <div className="btn-row">
                <button type='submit' disabled={isLoading}>
                    Submit
                </button>
                <button onClick={handleCloseAlertCLicked} disabled={isLoading}>
                    Cancel
                </button>
            </div>
        </form>
    </div>
  )
}

export default AlertCreationForm