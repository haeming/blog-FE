import getAuthHeaders from "../commons/utils/authHeaders";
import { request } from "./request";

export default function postApi(){
    const postCount = async () => {
        const config = getAuthHeaders();
        return await request("get", "/api/admin/posts/count", null, config);
    }

    const getPost = async (id) => {
        const config = getAuthHeaders();
        return await request("get", `/api/admin/posts/${id}`, null, config);
    }

    const getPosts = async( page = 0, size = 10, sort="createdAt,desc" ) => {
        const config = getAuthHeaders();
        const params = new URLSearchParams({ page, size, sort }).toString();
        return await request("get", `/api/admin/posts?${params}`, null, config);
    }

    const createPost = async(postData, files) => {
        const config = getAuthHeaders();
        const formData = new FormData();
        const { title, content, categoryId } = postData;
        formData.append(
            "data",
            new Blob([JSON.stringify({ title, content, categoryId })], { type: "application/json" })
        );

        if(files && files.length > 0){
            files.forEach(file => {
                formData.append("file", file);
            })
        }

        return await request("post", "/api/admin/posts", formData, config);
    }

    const deletePost = async(id) => {
        const config = getAuthHeaders();
        return await request("delete", `/api/admin/posts/${id}`, null, config);
    }

    const uploadTempImages = async (files) => {
        const config = getAuthHeaders();
        const formData = new FormData();

        files.forEach((file) => formData.append("file", file));

        return await request("post", "/api/admin/posts/temp-image", formData, config);
    };

    const updatePostInfo = async (id, {title, content, categoryId}) => {
        const config = getAuthHeaders();
        return await request("patch", `/api/admin/posts/${id}/info`, {title, content, categoryId}, config);
    }

    return { postCount, createPost, getPost, getPosts, deletePost, uploadTempImages, updatePostInfo };
}