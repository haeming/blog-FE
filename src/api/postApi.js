import getAuthHeaders from "../commons/utils/authHeaders";
import { request } from "./request";

export default function postApi(){
    const postCount = async () => {
        const config = getAuthHeaders();
        return await request("get", "/api/admin/posts/count", null, config);
    }

    return { postCount };
}