import getAuthHeaders from "../commons/utils/authHeaders.js";
import {request} from "./request";

export default function commentApi(){
    const commentCount = async () => {
        const config = getAuthHeaders();
        return await request("get", "/api/admin/comments/count", null, config);
    };

    const commentList = async (postId) => {
        const config = {
            ...getAuthHeaders(),
            params: { postId }
        };
        return await request("get", "/api/admin/comments", null, config);
    }

    const createComment = async (commentData) => {
        const config = getAuthHeaders();
        return await request("post", "/api/admin/comments", commentData, config);
    }

    return { commentCount, commentList, createComment };
}