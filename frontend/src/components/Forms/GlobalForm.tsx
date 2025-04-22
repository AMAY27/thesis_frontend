import React from 'react'
import './GlobalForm.css'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format, parse } from 'date-fns';

export interface BaseEventProps {
    user_id: string;
    title: string;
    classname: string;
    start_time: string;
    end_time: string;
    start_date: string;
    end_date: string;
    status: string;
}

interface BaseEventFormProps {
    onSubmit: (data: BaseEventProps) => void;
    handleCancelClicked: () => void | undefined;
    initialValues?: Partial<BaseEventProps>;
    children?: React.ReactNode;
}

const GlobalForm: React.FC<BaseEventFormProps> = ({onSubmit, initialValues, children, handleCancelClicked}) => {

    const events = ['AlaramClock', 'Blending', 'Breaking','Canopening','Cat', 'Chirpingbirds', 'Clapping', 'Clarinet', 'Clocktick', 'Crying', 'Cupboard', 'Displaying_furniture', 'Dog', 'DoorBell','Dragonground','Drill','Drinking', 'Drum', 'Femalespeaking', 'Flute', 'Glass', 'Guitar', 'Hairdryer', 'Covidcough', 'Help', 'Hen', 'Hihat', 'Hit', 'Jackhammer', 'Keyboardtyping', 'Kissing','Laughing', 'Lighter', 'Healthycough', 'Manspeaking', 'Metal-on-metal', 'Astmacough', 'Mouseclick', 'Ringtone', 'Rooster', 'Silence', 'Sitar', 'Sneezing', 'Snooring', 'Stapler', 'ToiletFlush','Toothbrush','Trampler', 'Vaccumcleaner', 'Vandalism', 'WalkFootsteps', 'Washingmachine', 'Water', 'Whimper', 'Window', 'HandSaw', 'Siren', 'Whistling','Wind']

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<BaseEventProps>({
        user_id: initialValues?.user_id || "",
        title: initialValues?.title || "",
        classname: initialValues?.classname || "",
        start_time: initialValues?.start_time || "",
        end_time: initialValues?.end_time || "",
        start_date: initialValues?.start_date || "",
        end_date: initialValues?.end_date || "",
        status: initialValues?.status || "active"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTimeChange = (name: 'start_time' | 'end_time', value: string | null) => {
        setFormData(prev => ({
            ...prev,
            [name]: value || ""
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            user_id: "",
            title: "",
            classname: "",
            start_time: "",
            end_time: "",
            start_date: "",
            end_date: "",
            status: "active"
        })
        setIsLoading(false);
    };

    return (
        <div className='alert-form-div'>
        {isLoading && <div className="loading-overlay"><div className="spinner"></div></div>}
        <form onSubmit={handleSubmit} className='alert-form'>
            <div className="input-row">
                <div className='input-div'>
                    <label htmlFor="">Title</label>
                    <input type="text" name="title" onChange={handleChange} required value={formData.title}/>
                </div>
                <div className='input-div'>
                    <label htmlFor="classname">Class name</label>
                    <select name='classname' onChange={handleChange} value={formData.classname} required>
                        {events.map((event, index) => {
                            return <option key={index} value={event}>{event}</option>
                        })}
                    </select>
                </div>
            </div>
            {children}
            <div className="input-row">
                <div className='input-div'>
                    <label htmlFor="start_date">Start Date</label>
                    <input type="date" name="start_date" onChange={handleChange} min="2018-01-01" max="2030-12-31" value={formData.start_date} required/>
                </div>
                <div className='input-div'>
                    <label htmlFor="">End Date</label>
                    <input type="date" name="end_date" onChange={handleChange} min="2018-01-01" max="2030-12-31" value={formData.end_date} required/>
                </div>
            </div>
            <div className="input-row">
                <div className='input-div'>
                    <label htmlFor="">Start Time</label>
                    <TimePicker 
                        onChange={(value) => {
                            if (value) {
                              handleTimeChange('start_time', format(value, 'HH:mm'));
                            } else {
                              handleTimeChange('start_time', '');
                            }
                        }} 
                        value={
                            formData.start_time
                              ? parse(formData.start_time, 'HH:mm', new Date())
                              : null
                        }
                        format="HH:mm"
                        ampm={false}
                    />
                </div>
                <div className='input-div'>
                    <label htmlFor="">End Time</label>
                    <TimePicker 
                        onChange={(value) => {
                            if (value) {
                              handleTimeChange('end_time', format(value, 'HH:mm'));
                            } else {
                              handleTimeChange('end_time', '');
                            }
                        }} 
                        value={
                            formData.end_time
                              ? parse(formData.end_time, 'HH:mm', new Date())
                              : null
                        }
                        format="HH:mm"
                        ampm={false}
                    />               
                </div>
            </div>
            <div className="btn-row">
                <button type='submit' disabled={isLoading}>
                    Submit
                </button>
                <button onClick={handleCancelClicked} disabled={isLoading}>
                    Cancel
                </button>
            </div>
        </form>
    </div>
    )

}

export default GlobalForm