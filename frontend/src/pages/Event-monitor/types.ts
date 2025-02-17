export interface SoundCount {
    _id: string;
    count: number;
}
  
export interface EventsMonitorData {
    oneHour: SoundCount[];
    threeHour: SoundCount[];
    sixHour: SoundCount[];
    twelveHour: SoundCount[];
    twentyFourHour: SoundCount[];
}