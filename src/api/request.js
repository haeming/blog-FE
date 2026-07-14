import axios from "axios";
import baseURL from "../config/apiBaseUrl.js";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("accountName");
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
        console.error("API error", error);
        throw error;
    }
}
