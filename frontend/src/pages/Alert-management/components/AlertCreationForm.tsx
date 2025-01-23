import React from 'react';
import './AlertCreationForm.css'

interface AlertCreationFormProps {
    handleCloseAlertCLicked: () => void;
}

const AlertCreationForm:React.FC<AlertCreationFormProps> = ({handleCloseAlertCLicked}) => {
  return (
    <div className='alert-form-div'>
        <form action="" className='alert-form'>
            <div className="input-row">
                <div className='input-div'>
                    <label htmlFor="">Title</label>
                    <input type="text" name="" id="" />
                </div>
                <div className='input-div'>
                    <label htmlFor="">Class name</label>
                    <select>
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
                <label htmlFor="">Alert Type</label>
                <select name="" id="">
                    <option value="active">
                        <h5>On Detection</h5>
                        <p>Triggered when event is detected</p>
                    </option>
                    <option value="inactive">
                        <h5>On Non-detection</h5>
                        <p>Triggered when event is not detected</p>
                    </option>
                </select>
            </div>
            <div className="input-row">
                <div className='input-div'>
                    <label htmlFor="">Start Date</label>
                    <input type="date" name="start_date" id="" min="2018-01-01" max="2030-12-31" />
                </div>
                <div className='input-div'>
                    <label htmlFor="">End Date</label>
                    <input type="date" name="end_date" id="" min="2018-01-01" max="2030-12-31" />
                </div>
            </div>
            <div className="input-row">
                <div className='input-div'>
                    <label htmlFor="">Start Time</label>
                    <input type="time" name="start_time" required />
                </div>
                <div className='input-div'>
                    <label htmlFor="">End Time</label>
                    <input type="time" name="end_time" required />
                </div>
            </div>
            <div className="btn-row">
                <button onClick={handleCloseAlertCLicked}>
                    Submit
                </button>
                <button>
                    Cancel
                </button>
            </div>
        </form>
    </div>
  )
}

export default AlertCreationForm