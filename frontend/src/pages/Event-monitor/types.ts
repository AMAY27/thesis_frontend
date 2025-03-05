export interface SoundCount {
    _id: string;
    count: number;
}
  
export interface EventsMonitorData {
    fiveMinutes: SoundCount[];
    fifteenMinutes: SoundCount[];
    thirtyMinutes: SoundCount[];
    oneHour: SoundCount[];
    threeHour: SoundCount[];
    sixHour: SoundCount[];
    twelveHour: SoundCount[];
    twentyFourHour: SoundCount[];
    yesterday: SoundCount[];
    dayBeforeYesterday: SoundCount[];
}

export interface ChartData {
    _id: string;
    count: number;
}
export interface EventMonitorBarChartProps {
    data: SoundCount[];
}