import { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from '../../axios/axios';
import notification from '../../axios/notification';
import { EventsMonitorData } from './types';

export const getEventsMonitorData = async <TResponse> (
    url: string,
    config?: AxiosRequestConfig
): Promise<TResponse> => {
    try {
        const resp = await axiosInstance.get<TResponse>(url,config);
        return resp.data
    } catch (error) {
        const message = (error as AxiosError<{message: string}>).response?.data?.message;
        notification(`Error while fetching ${url}. ${message ?? ''}`, 'error');
        throw error;
    }
}