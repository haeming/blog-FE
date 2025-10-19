import getAuthHeaders from "../commons/utils/authHeaders";
import { request } from "./request";

export default function imageApi(){
    // const uploadTempImages = async (file) => {
    //     const config = getAuthHeaders();
    //     const formData = new FormData();
    //
    //     formData.append("file", file);
    //     const response = await request("post", "/api/admin/images/temp-image", formData, config);
    //     return response.result;
    // };
    const uploadTempImages = async (formData) => {
        const config = getAuthHeaders();
        return await request("post", "/api/admin/images/temp-image", formData, config);
    };

    return { uploadTempImages };
}