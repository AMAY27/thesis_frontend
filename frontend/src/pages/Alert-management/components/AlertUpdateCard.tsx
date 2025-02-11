import React from 'react'
import { AlertUpdateProps } from '../types';
import GlobalForm from '../../../components/Forms/GlobalForm';

const AlertUpdateCard:React.FC<AlertUpdateProps> = ({user_id, title, classname, start_date, end_date, start_time, end_time, status}) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [alertType, setAlertType] = React.useState<string>("active");

    const handleSubmit = () => {
        console.log("submitting")
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setAlertType(value);
    }
  return (
    <>
        {isEditing ? 
            (
                <>
                    <GlobalForm 
                        onSubmit={handleSubmit}
                        initialValues={{
                            user_id: user_id,
                            title: title,
                            classname: classname,
                            start_time: start_time,
                            end_time: end_time,
                            start_date: start_date,
                            end_date: end_date,
                            status: status
                        }}
                    >
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
                    </GlobalForm>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : 
            (
                <div>
                    <h2>{title}</h2>
                    <p>{classname}</p>
                    <p>{start_date}</p>
                    <p>{end_date}</p>
                    <p>{start_time}</p>
                    <p>{end_time}</p>
                    <p>{status}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )
        }
    </>
  )
}

export default AlertUpdateCard