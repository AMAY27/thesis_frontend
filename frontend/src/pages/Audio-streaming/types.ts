export type LiveEvent = {
    ClassName: string;
    ClassName_German: string;
    confidence: number;
    Datetime: string;
    Datetime_2: string;
};

export type SoundCountForMonitoring = Map<string, number>;

export interface EventsMonitoringData {
    fiveMinutes: SoundCountForMonitoring;
    fifteenMinutes: SoundCountForMonitoring;
    thirtyMinutes: SoundCountForMonitoring;
    oneHour: SoundCountForMonitoring;
    threeHour: SoundCountForMonitoring;
    sixHour: SoundCountForMonitoring;
    twelveHour: SoundCountForMonitoring;
    twentyFourHour: SoundCountForMonitoring;
    yesterday: SoundCountForMonitoring;
    dayBeforeYesterday: SoundCountForMonitoring;
}