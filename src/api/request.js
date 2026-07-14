import axios from "axios";
import baseURL from "../config/apiBaseUrl.js";
import { AUTH_TOKEN_KEY, ACCOUNT_NAME_KEY } from "../commons/utils/authStorageKeys.js";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(ACCOUNT_NAME_KEY);
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export const request = async (method, url, data, config) => {
    try{
        const response = await axiosInstance({
            method,
            url: `${baseURL}${url}`, data, ...config
        })
        return response.data;
    } catch (error){
        console.error("API error", error.response?.status, error.config?.url, error.message);
        throw error;
    }
}
