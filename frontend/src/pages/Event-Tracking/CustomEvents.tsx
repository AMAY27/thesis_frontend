import React, { useEffect } from 'react'
import hoc from "../../hoc/hoc"
import GlobalForm from "../../components/Forms/GlobalForm";
import { CustomEventAnalyticsProps } from './types';
import { DailyFrequencyDto } from './types';
import './CustomEvents.css'
import notification from '../../axios/notification';
import CustomEventsGraph from './components/CustomEventsGraph';
import CustomEventsDetailsAndUpdateCard from './components/CustomEventsDetailsAndUpdateCard';
import { saveCustomEvent, getCustomEventsForAnalytics } from './indexDBServices';
import { AddAlertProps } from '../Alert-management/types';

const CustomEvents = () => {
    // const [mobileAlertClicked, setMobileAlertClicked] = React.useState<Boolean>(false);
    const [isLoading, setIsLoading] = React.useState<Boolean>(false);
    const [isMobile, setIsMobile] = React.useState<Boolean>(false);
    const [customEvents, setCustomEvents] = React.useState<CustomEventAnalyticsProps[]>([]);
    const [customEventAnalytics, setCustomEventAnalytics] = React.useState<CustomEventAnalyticsProps>();
    const [graphFormat, setGraphFormat] = React.useState<string>("daily");
    const [monthForDailyAnalytics, setMonthForDailyAnalytics] = React.useState<string>("");
    const [dailyFrequency, setDailyFrequency] = React.useState<DailyFrequencyDto[]>([]);
    const [addEventsClicked, setAddEventsClicked] = React.useState<Boolean>(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 1000);
        // setMobileAlertClicked(window.innerWidth <= 1000);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      }
    },[]);

    const fetchCustomEvents = async () => {
      setIsLoading(true);
      try {
        const resp = await getCustomEventsForAnalytics();
        setCustomEvents(resp);
        setCustomEventAnalytics(resp[0]);
        setDailyFrequency(resp[0]?.frequencies[0]?.dailyFrequency ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      fetchCustomEvents();
      // setIsLoading(false);
    },[]);

    const handleSubmit = async (data: AddAlertProps) => {
      try {
        // await postCustomEvents("/custom-events/create", data);
        saveCustomEvent(data).then(() => {
          notification("Custom Event created successfully", "success");
        })
        // notification("Custom Event created successfully", "success");
        fetchCustomEvents();
        setAddEventsClicked(false);
      } catch (error) {
        // error already handled in api.service.ts
      }
      console.log(data);
    }

    const handleEventSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setIsLoading(true);
      if(e.target.value) {
        const resp = customEvents.find((event) => event.customEventDetails.createdAt === Number(e.target.value));
        if(resp){
          setCustomEventAnalytics(resp);
          if (resp.frequencies && resp.frequencies.length > 0) {
            setMonthForDailyAnalytics(resp.frequencies[0].month);
            setDailyFrequency(resp.frequencies[0].dailyFrequency);
          }
        }
        console.log(customEventAnalytics)
      }
      setIsLoading(false);
    }

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      setMonthForDailyAnalytics(e.target.value);
      setDailyFrequency(customEventAnalytics?.frequencies?.find((freq) => freq.month === e.target.value)?.dailyFrequency ?? []);
      console.log(dailyFrequency);
    }

    const handleDailyClicked = () => {
      setGraphFormat("daily");
      setDailyFrequency(customEventAnalytics?.frequencies[0]?.dailyFrequency ?? []);
    }


    // if (clickedNavItem !== "customevents") {
    //     return null;
    // }
  return (
    <div className='custom-events'>
      {isLoading &&
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
      }   
      {addEventsClicked && 
        <div className='form-overlay'>
          <GlobalForm handleCancelClicked={() => setAddEventsClicked(false)} onSubmit={handleSubmit}/>
        </div>
      }
      {isMobile && 
        <div className='custom-events-mobile-container'>
          <button
            className='mobile-add-custom-events-button'
            onClick={() => setAddEventsClicked(true)}
          >
            Add Custom Events
          </button>
          <select name="select-custom-event" id="" onChange={handleEventSelect} style={{width: '100%', marginTop: '10px'}}>
            {customEvents.map((event) => (
              <option value={event.customEventDetails?.id} key={event.customEventDetails?.id}>{event.customEventDetails?.title}</option>
            ))}
          </select>
          <CustomEventsDetailsAndUpdateCard
            id={customEventAnalytics?.customEventDetails.id || ''}
            title={customEventAnalytics?.customEventDetails.title || ''}
            classname={customEventAnalytics?.customEventDetails.classname || ''}
            start_date={customEventAnalytics?.customEventDetails.start_date || ''}
            end_date={customEventAnalytics?.customEventDetails.end_date || ''}
            start_time={customEventAnalytics?.customEventDetails.start_time || ''}
            end_time={customEventAnalytics?.customEventDetails.end_time || ''}
            status={customEventAnalytics?.customEventDetails.status || ''}
            createdAt={customEventAnalytics?.customEventDetails.createdAt ?? 0}
          />
        </div>
      }
      {!isMobile && <div className='custom-events-header'>
        <div className='custom-events-select-div'>
          <p>Select From Saved Custom Events:</p>
          <select name="select-custom-event" id="" onChange={handleEventSelect}>
            {customEvents.map((event) => (
              <option value={event.customEventDetails?.createdAt} key={event.customEventDetails?.createdAt}>{event.customEventDetails?.title}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setAddEventsClicked(true)}>Add Custom Event</button>
      </div>}
      <div className='custom-events-details-container'>
        <CustomEventsDetailsAndUpdateCard
          id={customEventAnalytics?.customEventDetails.id || ''}
          title={customEventAnalytics?.customEventDetails.title || ''}
          classname={customEventAnalytics?.customEventDetails.classname || ''}
          start_date={customEventAnalytics?.customEventDetails.start_date || ''}
          end_date={customEventAnalytics?.customEventDetails.end_date || ''}
          start_time={customEventAnalytics?.customEventDetails.start_time || ''}
          end_time={customEventAnalytics?.customEventDetails.end_time || ''}
          status={customEventAnalytics?.customEventDetails.status || ''}
          createdAt={customEventAnalytics?.customEventDetails.createdAt ?? 0}
        />
      </div>
      <div className='custom-events-graph-container'>
        <div className='graph-format-selector'>
          <div className={`${graphFormat  === 'monthly' ? 'format-active': ''}`} onClick={() => setGraphFormat("monthly")}>Monthly</div>
          <div className={`${graphFormat  === 'daily' ? 'format-active': ''}`} onClick={handleDailyClicked}>Daily</div>
        </div>
        <div className='custom-events-graph'>
          {
          
            graphFormat === 'monthly' && customEventAnalytics?.frequencies?.length && customEventAnalytics.frequencies.length > 0 ? 
          
            (
              <CustomEventsGraph 
                data={customEventAnalytics.frequencies.map((freq) => ({
                  month: freq.month,
                  count: freq.freq
                }))} 
                graphType="monthly"
              />
            ) :
            graphFormat === 'daily' && customEventAnalytics?.frequencies?.length && customEventAnalytics.frequencies.length > 0 ? 
            
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
            ) : customEventAnalytics?.frequencies?.length == 0 ?
            (
              <div className='no-data'>No Data Available</div>
            ) :
            (
              <div className='no-data'>Please Select the Custom Event</div>
            )
          }
        </div>
      </div>
    </div>
    
  )
}

export default hoc(CustomEvents)