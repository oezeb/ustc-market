import axios from "axios";

import { getToken } from "@/utils/auth";

const service = axios.create();

// request interceptor
service.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// response interceptor
service.interceptors.response.use(
    (response) => {
        console.log(response); // for debug
        return response;
    },
    (error) => {
        console.error(error); // for debug
        const e = new Error(error.response?.data?.detail || error.message);
        e.data = error.response?.data;
        throw e;
    }
);

export default service;
