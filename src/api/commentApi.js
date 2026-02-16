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

    const updateComment = async (commentId, commentData) => {
        const config = getAuthHeaders();
        return await request("patch", `/api/admin/comments/${commentId}`, commentData, config);
    }

    const deleteComment = async (commentId) => {
        const config = getAuthHeaders();
        return await request("delete", `/api/admin/comments/${commentId}`, null, config);
    }

    return { commentCount, commentList, createComment, updateComment, deleteComment };
}