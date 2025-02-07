import React from 'react';
import {Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer} from 'recharts';

interface MonthlyData {
    month: string;
    count: number;
}

interface DailyData {
    date: string;
    count: number;
}

// Define the props interface
interface CustomEventsGraphProps {
    data: MonthlyData[] | DailyData[];
    graphType: 'monthly' | 'daily';
}

const CustomEventsGraph:React.FC<CustomEventsGraphProps> = ({data, graphType}) => {
    const xAxisKey = graphType === 'monthly' ? 'month' : 'date';
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

export default CustomEventsGraph