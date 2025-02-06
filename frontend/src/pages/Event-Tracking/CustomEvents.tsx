import React, { useEffect } from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import GlobalForm from "../../components/Forms/GlobalForm";
import { BaseEventProps } from "../../components/Forms/GlobalForm";
import { CustomEventProps, CustomEventAnalyticsProps } from './types';
import { getCustomEvents, getCustomEventAnalytics } from './api.service';
import './CustomEvents.css'

const CustomEvents = () => {
    const { clickedNavItem } = useNavContext();
    const [mobileAlertClicked, setMobileAlertClicked] = React.useState<Boolean>(false);
    const [isMobile, setIsMobile] = React.useState<Boolean>(false);
    const [customEvents, setCustomEvents] = React.useState<CustomEventProps[]>([]);
    const [customEventAnalytics, setCustomEventAnalytics] = React.useState<CustomEventAnalyticsProps>();
    const [graphFormat, setGraphFormat] = React.useState<string>("monthly");

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 1000);
        setMobileAlertClicked(window.innerWidth <= 1000 ? mobileAlertClicked : false);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      }
    },[]);

    const fetchCustomEvents = async () => {
      const resp:CustomEventProps[] = await getCustomEvents<CustomEventProps[]>("/custom-events/getCustomEvents", "676bdb353db50d80a5c8a82a");
      setCustomEvents(resp);
    }

    useEffect(() => {
      fetchCustomEvents();
    },[]);

    const handleSubmit = (data: BaseEventProps) => {
      console.log(data);
    }

    const handleEventSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      if(e.target.value) {
        const resp:CustomEventAnalyticsProps = await getCustomEventAnalytics("/custom-events/getEventAnalytics", "676bdb353db50d80a5c8a82a", e.target.value);
        setCustomEventAnalytics(resp);
      }
    }


    if (clickedNavItem !== "customevents") {
        return null;
    }
  return (
    <div className='custom-events'>
      <div className='custom-events-left-container'>
        <div className='custom-events-header'>
          <h4>{customEventAnalytics?.customEventTitle}</h4>
          {/* <label htmlFor="select-custom-event">Select Custom Event</label> */}
          <select name="select-custom-event" id="" onChange={handleEventSelect}>
            <option value={""} >Select</option>
            {customEvents.map((event) => (
              <option value={event.id} key={event.id}>{event.title}</option>
            ))}
          </select>
        </div>
        <div className='graph-format-selector'>
          <div className={`${graphFormat  === 'monthly' ? 'format-active': ''}`} onClick={() => setGraphFormat("monthly")}>Monthly</div>
          <div className={`${graphFormat  === 'daily' ? 'format-active': ''}`} onClick={() => setGraphFormat("daily")}>Daily</div>
        </div>
      </div>
      <div className='custom-events-right-container'>
        <GlobalForm onSubmit={handleSubmit}/>
      </div>
    </div>
    
  )
}

export default hoc(CustomEvents)