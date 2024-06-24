import axios, { AxiosError, AxiosResponse } from 'axios';

export const http = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        Content: 'application/json',
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('token');

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

http.interceptors.response.use(
    function (res: AxiosResponse) {
        return res;
    },
    function (err: AxiosError) {
        console.error(err);
        const token = sessionStorage.getItem("token");
        if(!token) {
            window.location.href = '/login'
        }

        if (err.response?.status === 403) {
            window.location.href = '/login';
            sessionStorage.removeItem('token');
        }
        return Promise.reject(err);
    }
);
