import getAuthHeaders from "../commons/utils/authHeaders.js";
import {request} from "./request";

export default function commentApi(){
    const commentCount = async () => {
        const config = getAuthHeaders();
        return await request("get", "/api/admin/comments/count", null, config);
    };

    return { commentCount };
}