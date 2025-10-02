import {useCallback, useMemo} from "react";
import axios from "axios";
import baseURL from "../config/apiBaseUrl.js";
import getAuthHeaders from "../commons/utils/authHeaders.js";

export default function useCategory(){

    const categoryCount = useCallback(async() => {
        try {
            const config = getAuthHeaders();
            const response = await axios.get(`${baseURL}/api/admin/categories/count`, config);
            return response.data;
        } catch (error){
            console.error("category Api error:", error);
            throw error;
        }
    }, [])

    return useMemo(() => ({categoryCount}), [categoryCount])

}