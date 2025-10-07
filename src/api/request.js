import axios from "axios";
import baseURL from "../config/apiBaseUrl.js";

export const request = async (method, url, data, config) => {
    try{
        const response = await axios({
            method,
            url: `${baseURL}${url}`, data, ...config
        })
        return response.data;
    } catch (error){
        console.error("API error", error);
        throw error;
    }
}