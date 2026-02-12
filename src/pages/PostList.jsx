import {useEffect, useMemo, useState} from "react"
import postApi from "../api/postApi";
import usePageService from "../commons/hooks/useNavigationService";
import useDateFormat from "../commons/hooks/useDateFormat.js";

export default function PostList(){
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size] = useState(10);
    const [postList, setPostList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // postApi()가 렌더마다 새 객체를 만들면 useEffect 의존성 관리가 꼬일 수 있어 고정 권장
    const post = useMemo(() => postApi(), []);
    const pageService = usePageService();
    const { formatDateTime } = useDateFormat();

    useEffect(() => {
        let mounted = true;

        const fetchPosts = async () => {
            setLoading(true);
            setErrorMsg("");

            try {
                // ✅ postApi가 (page, size, sort) 시그니처인 경우도 방어
                const response = await post.getPosts(page, size, "createdAt,desc");

                // ✅ 응답 형태 방어:
                // - pageable: { content: [], totalPages: n }
                // - array: []
                const content = Array.isArray(response) ? response : (response?.content ?? []);
                const total = Array.isArray(response) ? 0 : (response?.totalPages ?? 0);

                if (!mounted) return;
                setPostList(content);
                setTotalPages(total);
            } catch (error) {
                console.error("게시글 리스트 불러오기 에러", error);
                if (!mounted) return;
                setErrorMsg("게시글 목록을 불러오지 못했습니다.");
                setPostList([]);
                setTotalPages(0);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchPosts();

        return () => {
            mounted = false;
        };
    }, [page, size, post]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            {loading && (
                <div className="text-center text-gray-500 py-10">
                    불러오는 중입니다...
                </div>
            )}

            {!loading && errorMsg && (
                <div className="text-center text-red-500 py-10">
                    {errorMsg}
                </div>
            )}

            {!loading && !errorMsg && postList.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    등록된 게시글이 없습니다.
                </div>
            ) : (
                !loading &&
                !errorMsg &&
                postList.map((p, index) => (
                    <div
                        key={p.id ?? index}
                        className="border-b border-b-neutral-300 p-4 hover:text-custom-purple hover:border-b-custom-purple"
                    >
                        <div
                            className="cursor-pointer"
                            onClick={() => pageService.goToPostDetail(p.id)}
                        >
                            <h3 className="text-lg font-semibold">{p.title}</h3>
                            <p className="text-gray-600 line-clamp-3 mb-3">{p.content}</p>
                        </div>

                        <div className="text-custom-gray2 font-thin text-xs">
              <span className="text-custom-purple2 font-semibold">
                {p.categoryName}
              </span>
                            <span className="mx-3">|</span>
                            <span>{formatDateTime(p.createdAt)}</span>
                        </div>
                    </div>
                ))
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
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