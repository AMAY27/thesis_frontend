import axios, { AxiosError } from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_NEST_BACKEND_URL,
});

// Separate variable for Flask URL
export const axiosInstanceFlask = axios.create({
    baseURL: import.meta.env.VITE_NEST_FLASK_URL,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (axios.isCancel(error)) {
            // Handle 401 error
            window.console.log('Request canceled', error.message);
        }
        return Promise.reject(error);
    }
)