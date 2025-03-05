import React from 'react'
import {Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer} from 'recharts';
import { EventMonitorBarChartProps } from '../types';

const EventMonitorBarChart:React.FC<EventMonitorBarChartProps> = ({data}) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="_id" />
          <YAxis dataKey="count"/>
          <Tooltip />
          <Bar dataKey="count" fill="#62B2C0" />
        </BarChart>
    </ResponsiveContainer>
  )
}

export default EventMonitorBarChart