import postApi from "../api/postApi";

const api = postApi();

const postCount = async () => {
    try {
        const response = await api.postCount();
        return response.data?.data;
    } catch (error){
        console.error("postService postCount error:", error);
        throw error;
    }
};

export const postService = { postCount };