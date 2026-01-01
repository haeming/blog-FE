import {request} from "./request.js";

export const visitApi = {
    ping: async () => {
        return await request("post", "/api/visits/ping", null, null);
    },
};