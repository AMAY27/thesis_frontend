import React from 'react'
import {Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer} from 'recharts';

interface ChartData {
    _id: string;
    count: number;
}
interface EventMonitorBarChartProps {
    data: ChartData[];
    xAxisKey: string;
}
const EventMonitorBarChart:React.FC<EventMonitorBarChartProps> = ({data, xAxisKey}) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey={xAxisKey} />
          <YAxis dataKey="count"/>
          <Tooltip />
          <Bar dataKey="count" fill="#62B2C0" />
        </BarChart>
    </ResponsiveContainer>
  )
}

export default EventMonitorBarChart