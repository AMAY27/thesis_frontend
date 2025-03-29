import { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstanceFlask } from '../../axios/axios';
import notification from '../../axios/notification';

export interface ApiResponse {
    class_counts: Record<string, number>;
    records: RecordItem[];
}

export interface RecordItem {
    ClassName: string;
    ClassName_German: string;
    filename: string;
    timepoint: string;
}



export const sendRecordingForAnalysis = async <TResponse> (
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig 
): Promise<TResponse> => {
    try {
        const resp = await axiosInstanceFlask.post<TResponse>(url, formData, config);
        return resp.data;
    } catch (error) {
        const message = (error as AxiosError<{message: string}>).response?.data?.message;
        notification(`Error while fetching ${url}. ${message ?? ''}`, 'error');
        throw error;
    }
}