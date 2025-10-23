import usePageService from "../commons/hooks/useNavigationService"
import { Grape, FolderClosed, MessageSquareMore, PencilLine, Newspaper, MessageSquareHeart, UsersRound, ArrowRight } from 'lucide-react';
import { useEffect, useState } from "react";
import postApi from "../api/postApi.js";

export default function Home(){

    const [postCount, setPostCount] = useState(0);
    const pageService = usePageService();
    const post = postApi();

    const getPostCount = async () => {
        try {
            const count = await post.postCount();
            setPostCount(count.result);
        } catch (error){
            console.error("게시글 불러오기 에러", error);
        }
    };

    useEffect(() => {
        getPostCount();
    },[])

    return(
        <>
            <div className="min-h-screen bg-neutral-50">
                <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

                    {/* 환영 메시지 */}
                    <div className="bg-custom-white border border-neutral-200 rounded-2xl p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900">
                                    환영합니다, Haemin님 <Grape className="inline align-middle" />
                                </h1>
                                <p className="text-neutral-600 mt-3 text-lg">오늘도 좋은 하루 되세요!</p>
                            </div>
                        </div>
                    </div>

                    {/* 통계 카드 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-custom-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-neutral-500 text-sm font-medium">전체 글</p>
                                    <p className="text-3xl font-bold mt-2 text-neutral-900">{(postCount ?? 0).toLocaleString()}</p>
                                </div>
                                <Newspaper className="w-10 h-10 text-custom-purple"/>
                            </div>
                        </div>

                        <div className="bg-custom-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-neutral-500 text-sm font-medium">댓글</p>
                                    <p className="text-3xl font-bold mt-2 text-neutral-900">156</p>
                                </div>
                                <MessageSquareHeart className="w-10 h-10 text-custom-purple" />
                            </div>
                        </div>

                        <div className="bg-custom-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-neutral-500 text-sm font-medium">방문자</p>
                                    <p className="text-3xl font-bold mt-2 text-neutral-900">1.2k</p>
                                </div>
                                <UsersRound className="w-10 h-10 text-custom-purple" />
                            </div>
                        </div>
                    </div>

                    {/* 빠른 액션 버튼 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <button className="bg-custom-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-900 rounded-2xl p-6 transition-all group cursor-pointer"
                            onClick={pageService.goToPostWrite}>
                            <PencilLine className="w-8 h-8 text-custom-purple2 inline align-middle" />
                            <div className="font-semibold text-lg">새 글 작성</div>
                        </button>
                        <button className="bg-custom-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-900 rounded-2xl p-6 transition-all group cursor-pointer"
                            onClick={pageService.goToCategory}>
                            <FolderClosed className="w-8 h-8 text-custom-purple2 inline align-middle" />
                            <div className="font-semibold text-lg">카테고리 관리</div>
                        </button>
                        <button className="bg-custom-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-900 rounded-2xl p-6 transition-all group cursor-pointer">
                            <MessageSquareMore className="w-8 h-8 text-custom-purple2 inline align-middle" />
                            <div className="font-semibold text-lg">댓글 관리</div>
                        </button>
                    </div>

                    {/* 최근 글 */}
                    <div className="bg-custom-white border border-neutral-200 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900">최근 작성한 글</h2>
                            <button className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors flex items-center gap-0.4 cursor-pointer">
                                전체보기 <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center text-lg">
                                        📌
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">
                                            React 최신 기능 정리
                                        </p>
                                        <p className="text-sm text-neutral-500 mt-1">2시간 전</p>
                                    </div>
                                </div>
                                <div className="text-neutral-400 group-hover:text-neutral-600 transition-colors">
                                    →
                                </div>
                            </li>
                            <li className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center text-lg">
                                        📌
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">
                                            Tailwind CSS 활용 팁
                                        </p>
                                        <p className="text-sm text-neutral-500 mt-1">1일 전</p>
                                    </div>
                                </div>
                                <div className="text-neutral-400 group-hover:text-neutral-600 transition-colors">
                                    →
                                </div>
                            </li>
                            <li className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center text-lg">
                                        📌
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">
                                            웹 개발 트렌드 2025
                                        </p>
                                        <p className="text-sm text-neutral-500 mt-1">3일 전</p>
                                    </div>
                                </div>
                                <div className="text-neutral-400 group-hover:text-neutral-600 transition-colors">
                                    →
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </>
    )
}