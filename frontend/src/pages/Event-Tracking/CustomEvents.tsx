import React from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import GlobalForm from "../../components/Forms/GlobalForm";
import { BaseEventProps } from "../../components/Forms/GlobalForm";

const CustomEvents = () => {
    const { clickedNavItem } = useNavContext();
    const [addAlertClicked, setAddAlertClicked] = React.useState<Boolean>(false);

    const handleSubmit = (data: BaseEventProps) => {
      console.log(data);
    }
    const handleCancelClicked = () => {
      setAddAlertClicked(false);
    }

    const handleAddEventClicked = () => {
      setAddAlertClicked(true);
    }

    if (clickedNavItem !== "customevents") {
        return null;
    }
  return (
    <div>
      <button className='' onClick={handleAddEventClicked}>Add Event</button>
      {addAlertClicked && <GlobalForm onSubmit={handleSubmit} handleCancelClicked={handleCancelClicked}/>}
    </div>
    
  )
}

export default hoc(CustomEvents)