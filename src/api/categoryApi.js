import {useCallback, useMemo} from "react";
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

    const getPostCountByCategoryId = useCallback(async (id) => {
        return await request("get", `/api/admin/categories/${id}/post-count`, null, config)
    }, [])

    const createCategory = useCallback(async (categoryName, file) => {
        const formData = new FormData();
        formData.append(
            "data",
            new Blob([JSON.stringify({ categoryName })], { type: "application/json" })
        );
        if (file) formData.append("file", file);

        return await request("post", "/api/admin/categories", formData, config);
    }, []);

    const updateCategory = useCallback(async(id, categoryName) => {
        return await request("put", `/api/admin/categories/${id}`, {categoryName}, config)
    }, [])

    const deleteCategory = useCallback(async(id) => {
        return await request("delete", `/api/admin/categories/${id}`, null, config)
    },[])

    return useMemo(() => ({
            categoryCount, createCategory, updateCategory, deleteCategory, getCategoryList, getPostCountByCategoryId
    }),[
        categoryCount, createCategory, updateCategory, deleteCategory, getCategoryList, getPostCountByCategoryId
    ])
}