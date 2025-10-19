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

    return { postCount, createPost, getPost, deletePost };
}