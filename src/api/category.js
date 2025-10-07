import {useCallback, useMemo} from "react";
import axios from "axios";
import baseURL from "../config/apiBaseUrl.js";
import getAuthHeaders from "../commons/utils/authHeaders.js";
import {request} from "./request.js";

export default function useCategory(){

    const config = getAuthHeaders();

    const categoryCount = useCallback(async() => {
        return await request("get", "/api/admin/categories/count", null, config)
    }, [])

    const getCategoryList = useCallback(async () => {
        return await request("get", "/api/admin/categories", null, config)
    }, [])

    const createCategory = useCallback(async(categoryName) => {
        return await request("post", "/api/admin/categories", {categoryName}, config)
    }, [])

    const updateCategory = useCallback(async(id, categoryName) => {
        return await request("put", `/api/admin/categories/${id}`, {categoryName}, config)
    }, [])

    const deleteCategory = useCallback(async(id) => {
        return await request("delete", `/api/admin/categories/${id}`, null, config)
    },[])

    return useMemo(() => ({categoryCount, createCategory, updateCategory, deleteCategory, getCategoryList}),
    [categoryCount, createCategory, updateCategory, deleteCategory, getCategoryList])
}