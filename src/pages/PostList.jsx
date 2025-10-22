import { useEffect, useState } from "react"
import postApi from "../api/postApi";

export default function PostList(){

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size] = useState(10);
    const [postList, setPostList] = useState([]);

    const post = postApi();

    useEffect(() => {
        const postList = async () => {
            try {
                const response = await post.getPosts(page, size);
                const pageData = response.result;
                setPostList(pageData.content || []);
                setTotalPages(pageData.totalPages || 0);
            } catch (error){
                console.error("게시글 리스트 불러오기 에러", error);
            }
        }

        postList();
    },[page, size])

    return(
        <>
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                {postList.map((p, index) => (
                    <div key={index} className="border-b p-4">
                        <h3 className="text-lg font-semibold">{p.title}</h3>
                        <p className="text-gray-600">{p.content}</p>
                    </div>
                ))}
            </div>
        </>
    )
}