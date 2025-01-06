// import React from 'react'
import hoc from "../../hoc/hoc"
import { useNavContext } from "../../global-context/NavContext";
import AlertCard from "./components/AlertCard";

const AlertManagement = () => {
  const { clickedNavItem } = useNavContext();

  if (clickedNavItem !== "alerts") {
    return null;
  }
  return (
    <div>
      <AlertCard 
        title="Alert 1" 
        timeRange={{start_time: "10:00", end_time: "11:00"}} 
        dateRange={{start_date: "2021-01-01", end_date: "2021-01-02"}} 
        createdAt="2021-01-01" 
        classname="Ruhe" 
        alertType="active"
      />
    </div>
  )
}

export default hoc(AlertManagement);