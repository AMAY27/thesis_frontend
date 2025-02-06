import { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from '../../axios/axios';
import notification from '../../axios/notification';

export const getCustomEvents = async <TResponse> (
    url: string,
    userId: string,
    config?: AxiosRequestConfig
) => {
    try {
        const resp = await axiosInstance.get<TResponse>(`${url}?userId=${userId}`, config);
        return resp.data;
    } catch (error) {
        const message = (error as AxiosError<{message: string}>).response?.data?.message;
        notification(`Error while fetching custom events. ${message ?? ''}`, 'error');
        throw error;
    }
}

export const getCustomEventAnalytics = async <TResponse> (
    url: string,
    userId: string,
    customEventId: string,
    config?: AxiosRequestConfig
) => {
    try {
        const resp = await axiosInstance.get<TResponse>(`${url}?userId=${userId}&customEventId=${customEventId}`, config);
        return resp.data;
    } catch (error) {
        const message = (error as AxiosError<{message: string}>).response?.data?.message;
        notification(`Error while fetching custom event analytics. ${message ?? ''}`, 'error');
        throw error;
    }
}