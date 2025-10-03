import {useCallback, useMemo} from "react";
import axios from "axios";
import baseURL from "../config/apiBaseUrl.js";
import getAuthHeaders from "../commons/utils/authHeaders.js";

export default function useCategory(){

    const config = getAuthHeaders();

    const categoryCount = useCallback(async() => {
        try {
            const response = await axios.get(`${baseURL}/api/admin/categories/count`, config);
            return response.data;
        } catch (error){
            console.error("category Api error:", error);
            throw error;
        }
    }, [])

    const createCategory = useCallback(async(categoryName) => {
        try{
            const response = await axios.post(
            `${baseURL}/api/admin/categories`,
            {categoryName},
                config
            )
            return response.data;
        } catch (error){
            console.error("createCategory error:", error);
            throw error;
        }
    }, [])

    return useMemo(() => ({categoryCount, createCategory}),
        [categoryCount, createCategory])

}