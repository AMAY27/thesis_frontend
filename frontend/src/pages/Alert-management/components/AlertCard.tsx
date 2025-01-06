import React from 'react'

type timeRange = {
    start_time: string;
    end_time: string;
}

type dateRange = {
    start_date: string;
    end_date: string;
}

interface AlertCardProps {
    title: string;
    classname: string;
    alertType: string;
    timeRange: timeRange;
    dateRange: dateRange;
    createdAt: string;
}

const AlertCard: React.FC<AlertCardProps> = ({title, timeRange, dateRange}) => {
  return (
    <div className='alertcard'>
        <h3>{title}</h3>
        <h4>{dateRange.start_date} - {dateRange.end_date}</h4>
        <h4>{timeRange.start_time} - {timeRange.end_time}</h4>
    </div>
  )
}

export default AlertCard