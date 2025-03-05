import React from 'react'
import {Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer} from 'recharts';
import { EventMonitorBarChartProps } from '../types';

const EventMonitorBarChart:React.FC<EventMonitorBarChartProps> = ({data}) => {

    const isEmpty = !data || data.length === 0;

  return (
    <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="_id" />
          <YAxis dataKey="count"/>
          <Tooltip />
          <Bar dataKey="count" fill="#62B2C0" />
          {isEmpty && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#888"
              style={{ fontSize: '16px' }}
            >
              No Data
            </text>
        )}
        </BarChart>
    </ResponsiveContainer>
  )
}

export default EventMonitorBarChart