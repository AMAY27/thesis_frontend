import React, { useEffect } from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import { BaseEventProps } from "../../components/Forms/GlobalForm";
import { CustomEventProps, CustomEventAnalyticsProps } from './types';
import { getCustomEvents, getCustomEventAnalytics, postCustomEvents } from './api.service';
import { DailyFrequencyDto } from './types';
import './CustomEvents.css'
import notification from '../../axios/notification';
import CustomEventsGraph from './components/CustomEventsGraph';
import CustomEventsDetailsAndUpdateCard from './components/CustomEventsDetailsAndUpdateCard';

const CustomEvents = () => {
    const { clickedNavItem } = useNavContext();
    const [mobileAlertClicked, setMobileAlertClicked] = React.useState<Boolean>(false);
    const [isLoading, setIsLoading] = React.useState<Boolean>(false);
    const [isMobile, setIsMobile] = React.useState<Boolean>(false);
    const [customEvents, setCustomEvents] = React.useState<CustomEventProps[]>([]);
    const [customEventAnalytics, setCustomEventAnalytics] = React.useState<CustomEventAnalyticsProps>();
    const [graphFormat, setGraphFormat] = React.useState<string>("monthly");
    const [monthForDailyAnalytics, setMonthForDailyAnalytics] = React.useState<string>("");
    const [dailyFrequency, setDailyFrequency] = React.useState<DailyFrequencyDto[]>([]);

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

    const handleSubmit = async (data: BaseEventProps) => {
      try {
        await postCustomEvents("/custom-events/create", data);
        notification("Custom Event created successfully", "success");
        fetchCustomEvents();
      } catch (error) {
        // error already handled in api.service.ts
      }
      console.log(data);
    }

    const handleEventSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      setIsLoading(true);
      if(e.target.value) {
        const resp:CustomEventAnalyticsProps = await getCustomEventAnalytics(
          "/custom-events/getEventAnalytics", 
          "676bdb353db50d80a5c8a82a", 
          e.target.value
        );
        setCustomEventAnalytics(resp);
        if (resp.frequencies && resp.frequencies.length > 0) {
          setMonthForDailyAnalytics(resp.frequencies[0].month);
          setDailyFrequency(resp.frequencies[0].dailyFrequency);
        }
        console.log(customEventAnalytics)
      }
      setIsLoading(false);
    }

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMonthForDailyAnalytics(e.target.value);
      setDailyFrequency(customEventAnalytics?.frequencies?.find((freq) => freq.month === e.target.value)?.dailyFrequency ?? []);
      console.log(dailyFrequency);
    }

    const handleDailyClicked = () => {
      setGraphFormat("daily");
      setDailyFrequency(customEventAnalytics?.frequencies[0]?.dailyFrequency ?? []);
    }


    if (clickedNavItem !== "customevents") {
        return null;
    }
  return (
    <div className='custom-events'>
      {isMobile && 
        <div className='custom-events-mobile-container'>
          <CustomEventsDetailsAndUpdateCard
            id={customEventAnalytics?.customEventDetails.id || ''}
            title={customEventAnalytics?.customEventDetails.title || ''}
            classname={customEventAnalytics?.customEventDetails.classname || ''}
            start_date={customEventAnalytics?.customEventDetails.start_date || ''}
            end_date={customEventAnalytics?.customEventDetails.end_date || ''}
            start_time={customEventAnalytics?.customEventDetails.start_time || ''}
            end_time={customEventAnalytics?.customEventDetails.end_time || ''}
            status={customEventAnalytics?.customEventDetails.status || ''}
          />
        </div>
      }
      <div className='custom-events-left-container'>
        <div className='custom-events-header'>
          {/* <h4>{customEventAnalytics?.customEventDetails.title}</h4> */}
          {/* <label htmlFor="select-custom-event">Select Custom Event</label> */}
          <button>Add</button>
          <select name="select-custom-event" id="" onChange={handleEventSelect}>
            <option value={""} >Select</option>
            {customEvents.map((event) => (
              <option value={event.id} key={event.id}>{event.title}</option>
            ))}
          </select>
        </div>
        <div className='graph-format-selector'>
          <div className={`${graphFormat  === 'monthly' ? 'format-active': ''}`} onClick={() => setGraphFormat("monthly")}>Monthly</div>
          <div className={`${graphFormat  === 'daily' ? 'format-active': ''}`} onClick={handleDailyClicked}>Daily</div>
        </div>
        <div className='custom-events-graph'>
          {
            isLoading ? 
              
            (
              <div className="loading-overlay">
                <div className="spinner"></div>
              </div>
            ) :
          
            graphFormat === 'monthly' && customEventAnalytics?.frequencies ? 
          
            (
              <CustomEventsGraph 
                data={customEventAnalytics.frequencies.map((freq) => ({
                  month: freq.month,
                  count: freq.freq
                }))} 
                graphType="monthly"
              />
            ) :
            graphFormat === 'daily' && customEventAnalytics?.frequencies ? 
            
            (
              <>
                <div className='day-selector'>
                  <select name="" id="" value={monthForDailyAnalytics} onChange={handleMonthChange}>
                    {customEventAnalytics?.frequencies?.map((freq) => {
                      return (
                        <option value={freq.month} key={freq.month}>{freq.month}</option>
                      )
                    })}
                  </select>
                </div>
                {dailyFrequency && dailyFrequency.length > 0 && (
                  <CustomEventsGraph data={dailyFrequency} graphType='daily'/>
                )}
              </>
            ) : 
            (
              <div className='no-data'>Please Select the Custom Event</div>
            )
          }
        </div>
      </div>
      <div className='custom-events-right-container'>
        <CustomEventsDetailsAndUpdateCard
          id={customEventAnalytics?.customEventDetails.id || ''}
          title={customEventAnalytics?.customEventDetails.title || ''}
          classname={customEventAnalytics?.customEventDetails.classname || ''}
          start_date={customEventAnalytics?.customEventDetails.start_date || ''}
          end_date={customEventAnalytics?.customEventDetails.end_date || ''}
          start_time={customEventAnalytics?.customEventDetails.start_time || ''}
          end_time={customEventAnalytics?.customEventDetails.end_time || ''}
          status={customEventAnalytics?.customEventDetails.status || ''}
        />
      </div>
    </div>
    
  )
}

export default hoc(CustomEvents)