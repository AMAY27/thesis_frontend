import React from 'react'
import './GlobalForm.css'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format, parse } from 'date-fns';
import { AddAlertProps } from '../../pages/Alert-management/types';


interface BaseEventFormProps {
    onSubmit: (data: AddAlertProps) => void;
    handleCancelClicked: () => void | undefined;
    initialValues?: Partial<AddAlertProps>;
    children?: React.ReactNode;
}

const GlobalForm: React.FC<BaseEventFormProps> = ({onSubmit, initialValues, children, handleCancelClicked}) => {
    const [dateError, setDateError] = React.useState<string>("");
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const events = ['AlaramClock', 'Blending', 'Breaking','Canopening','Cat', 'Chirpingbirds', 'Clapping', 'Clarinet', 'Clocktick', 'Crying', 'Cupboard', 'Displaying_furniture', 'Dog', 'DoorBell','Dragonground','Drill','Drinking', 'Drum', 'Femalespeaking', 'Flute', 'Glass', 'Guitar', 'Hairdryer', 'Covidcough', 'Help', 'Hen', 'Hihat', 'Hit', 'Jackhammer', 'Keyboardtyping', 'Kissing','Laughing', 'Lighter', 'Healthycough', 'Manspeaking', 'Metal-on-metal', 'Astmacough', 'Mouseclick', 'Ringtone', 'Rooster', 'Silence', 'Sitar', 'Sneezing', 'Snooring', 'Stapler', 'ToiletFlush','Toothbrush','Trampler', 'Vaccumcleaner', 'Vandalism', 'WalkFootsteps', 'Washingmachine', 'Water', 'Whimper', 'Window', 'HandSaw', 'Siren', 'Whistling','Wind']

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<AddAlertProps>({
        user_id: initialValues?.user_id || "",
        title: initialValues?.title || "",
        classname: initialValues?.classname || "AlaramClock",
        start_time: initialValues?.start_time || "00:00",
        end_time: initialValues?.end_time || "00:01",
        start_date: initialValues?.start_date || "",
        end_date: initialValues?.end_date || "",
        status: initialValues?.status || "active",
        alert_type: initialValues?.status || "active",
        createdAt: initialValues?.createdAt || Date.now(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // Date validation
            if (
                (name === "start_date" && updated.end_date && value > updated.end_date) ||
                (name === "end_date" && updated.start_date && value < updated.start_date)
            ) {
                setDateError("End date cannot be before start date.");
            } else if (
                (name === "start_date" || name === "end_date") &&
                value < format(new Date(), "yyyy-MM-dd")
            ) {
                setDateError("Date cannot be before today.");
            } else {
                setDateError("");
            }

            return updated;
        });
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
        if (!initialValues?.createdAt) {
            setFormData({
                user_id: "",
                title: "",
                classname: "AlaramClock",
                start_time: "",
                end_time: "",
                start_date: "",
                end_date: "",
                status: "active",
                alert_type: "active",
                createdAt: Date.now()
            });
            } else {
            // Optionally clear other fields if needed, but keep createdAt as is.
            setFormData(prev => ({
                ...prev,
                user_id: "",
                title: "",
                classname: "AlaramClock",
                start_time: "",
                end_time: "",
                start_date: "",
                end_date: "",
                status: "active"
                // keep createdAt unchanged
            }));
        }
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
                    <input type="date" name="start_date" onChange={handleChange} min={todayStr} max="2030-12-31" value={formData.start_date} required/>
                </div>
                <div className='input-div'>
                    <label htmlFor="">End Date</label>
                    <input type="date" name="end_date" onChange={handleChange} min={formData.start_date || todayStr} max="2030-12-31" value={formData.end_date} required/>
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
                <button type='submit' disabled={isLoading || !!dateError}>
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