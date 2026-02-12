import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostEditor from "../components/post/PostEditor.jsx";
import postApi from "../api/postApi.js";

export default function PostEdit() {
    const { id } = useParams();
    const post = postApi();

    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const load = async () => {
            const p = await post.getPost(id);
            // p가 PostResponseDto 그대로인지, ApiPayload 래핑인지에 따라 맞추세요.
            // 예: const data = p.data?.data ?? p;
            const data = p.data?.data ?? p;

            setInitialData({
                title: data.title,
                content: data.content,
                categoryId: data.categoryId, // 없으면 data.category?.id 등으로 맞춤
            });
        };
        load();
    }, [id]);

    const handleUpdate = async ({ title, content, categoryId }) => {
        const res = await post.updatePostInfo(id, { title, content, categoryId });
        return res.data?.data ?? res;
    };

    if (!initialData) return null; // 로딩 UI로 대체 가능

    return (
        <PostEditor
            key={id}
            mode="edit"
            initialData={initialData}
            onSubmit={handleUpdate}
        />
    );
}
