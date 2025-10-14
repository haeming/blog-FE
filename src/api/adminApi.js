import getAuthHeaders from "../commons/utils/authHeaders";
import { request } from "./request";

export const adminApi = {
    verifyToken: async () => {
        const config = getAuthHeaders();
        return await request("get", "/api/admin/verify-token", null, config);
    }
}