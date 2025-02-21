import { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from '../../axios/axios';
import notification from '../../axios/notification';
// import { createCustomEventProps } from './types';
import { BaseEventProps } from '../../components/Forms/GlobalForm';

export const getCustomEventAnalytics = async <TResponse> (
    url: string,
    userId: string,
    config?: AxiosRequestConfig
) => {
    try {
        const resp = await axiosInstance.get<TResponse>(`${url}?userId=${userId}`, config);
        return resp.data;
    } catch (error) {
        const message = (error as AxiosError<{message: string}>).response?.data?.message;
        notification(`Error while fetching custom event analytics. ${message ?? ''}`, 'error');
        throw error;
    }
}

export const postCustomEvents = async <TResponse> (
    url: string,
    body: BaseEventProps,
    config?: AxiosRequestConfig
) => {
    try {
        const resp = await axiosInstance.post<TResponse>(url, body, config);
        return resp.data;
    } catch (error) {
        const message = (error as AxiosError<{message: string}>).response?.data?.message;
        notification(`Error while creating custom event. ${message ?? ''}`, 'error');
        throw error;
    }
}