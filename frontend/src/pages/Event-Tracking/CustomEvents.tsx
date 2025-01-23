// import React from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";

const CustomEvents = () => {
    const { clickedNavItem } = useNavContext();

    if (clickedNavItem !== "customevents") {
        return null;
    }
  return (
    <div>Custom Events</div>
  )
}

export default hoc(CustomEvents)