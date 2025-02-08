import React from 'react'
import { CustomEventProps } from '../types'
import GlobalForm from '../../../components/Forms/GlobalForm';

const CustomEventsDetailsAndUpdateCard:React.FC<CustomEventProps> = ({id, title, classname, start_date, end_date, start_time, end_time, status}) => {
    const [isEditing, setIsEditing] = React.useState(false);

    const handleSubmit = () => {
        console.log("submitting")
    }
  return (
    <>
        {isEditing ? 
            (
                <>
                    <GlobalForm 
                        onSubmit={handleSubmit}
                        initialValues={{
                            user_id: id,
                            title: title,
                            classname: classname,
                            start_time: start_time,
                            end_time: end_time,
                            start_date: start_date,
                            end_date: end_date,
                            status: status
                        }}
                    />
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

export default CustomEventsDetailsAndUpdateCard