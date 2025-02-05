import React, { useEffect } from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import GlobalForm from "../../components/Forms/GlobalForm";
import { BaseEventProps } from "../../components/Forms/GlobalForm";
import './CustomEvents.css'

const CustomEvents = () => {
    const { clickedNavItem } = useNavContext();
    const [mobileAlertClicked, setMobileAlertClicked] = React.useState<Boolean>(false);
    const [isMobile, setIsMobile] = React.useState<Boolean>(false);

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

    const handleSubmit = (data: BaseEventProps) => {
      console.log(data);
    }


    if (clickedNavItem !== "customevents") {
        return null;
    }
  return (
    <div className='custom-events'>
      <div className='custom-events-left-container'>

      </div>
      <div className='custom-events-right-container'>
        <GlobalForm onSubmit={handleSubmit}/>
      </div>
    </div>
    
  )
}

export default hoc(CustomEvents)