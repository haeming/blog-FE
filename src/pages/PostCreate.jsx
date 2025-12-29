import PostEditor from "../components/post/PostEditor.jsx";
import postApi from "../api/postApi.js";

export default function PostCreate() {
    const post = postApi();

    const handleCreate = async ({ title, content, categoryId }) => {
        const postData = { title, content, categoryId };
        const response = await post.createPost(postData, []);
        // response 형태가 {id, ...}인지, 또는 ApiPayload인지에 따라 여기만 맞추면 됩니다.
        return response;
    };

    return <PostEditor mode="create" onSubmit={handleCreate} />;
}
