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
                            status: status,
                        }}
                        handleCancelClicked={() => setIsEditing(false)}
                    />
                </>
            ) : 
            (
                <div>
                    <div className='custom-event-details-header' style={{display: 'flex', justifyContent: 'space-between',alignItems: 'center'}}>
                        <h2>{title}</h2>
                        <button 
                            onClick={() => setIsEditing(true)}
                            style={{backgroundColor: '#62B2C0', color: 'white', padding: '5px 10px', borderRadius: '5px'}}
                        >Edit</button>
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label htmlFor='class' style={{color:'#62B2C0', fontWeight:'bold'}}>Class:</label> 
                        <p style={{ margin:'5px'}} className='class'>{classname}</p>
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label htmlFor='class' style={{color:'#62B2C0', fontWeight:'bold'}}>Date Range:</label> 
                        <p style={{ margin:'5px'}} className='class'>{start_date.split('T')[0]} to {end_date.split('T')[0]}</p>
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label htmlFor='class' style={{color:'#62B2C0', fontWeight:'bold'}}>Time Range:</label> 
                        <p style={{ margin:'5px'}} className='class'>{start_time} - {end_time}</p>
                    </div>
                </div>
            )
        }
    </>
  )
}

export default CustomEventsDetailsAndUpdateCard