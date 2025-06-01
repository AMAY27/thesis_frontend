export interface createCustomEventProps {
    user_id: string;
    title: string;
    classname: string;
    start_time: string;
    end_time: string;
    start_date: Date;
    end_date: Date;
    status: string;
}

export interface saveCustomEventProps {
    title: string;
    classname: string;
    start_time: string;
    end_time: string;
    start_date: Date;
    end_date: Date;
    status: string;
}

export interface CustomEventProps{
    id: string;
    title: string;
    classname: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    status: string;
    createdAt: number;
    reFetchCutstomEvents?: () => void;
}

export interface CustomEventAnalyticsProps {
    customEventDetails: CustomEventProps;
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