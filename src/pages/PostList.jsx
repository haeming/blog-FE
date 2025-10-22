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

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {postList.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
            등록된 게시글이 없습니다.
            </div>
        ) : (
            postList.map((p, index) => (
            <div key={p.id ?? index} className="border-b p-4">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-gray-600">{p.content}</p>
            </div>
            ))
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
            {/* 이전 페이지 버튼 */}
            <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className={`px-3 py-1 border rounded ${
                page === 0
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
            >
                이전
            </button>

            {/* 페이지 번호 버튼 */}
            {[...Array(totalPages)].map((_, idx) => (
                <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`px-3 py-1 border rounded ${
                    idx === page
                    ? "bg-gray-300 border-gray-400 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                >
                {idx + 1}
                </button>
            ))}

            {/* 다음 페이지 버튼 */}
            <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
                className={`px-3 py-1 border rounded ${
                page === totalPages - 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
            >
                다음
            </button>
            </div>
        )}
        </div>
    );
}