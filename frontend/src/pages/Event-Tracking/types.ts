export interface CustomEventProps{
    id: string;
    title: string;
    classname: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    status: string;
}

export interface CustomEventAnalyticsProps {
    customEventTitle: string;
    frequencies: FrequenciesDto[];
}

export interface FrequenciesDto {
    month: string;
    freq: number;
    dailyFrequency: DailyFrequencyDto[];
}

export interface DailyFrequencyDto {
    date: string;
    count: number;
}