import usePageService from "../commons/hooks/useNavigationService"
import { Grape, FolderClosed, MessageSquareMore, PencilLine, Newspaper, MessageSquareHeart, UsersRound, Home, Settings, BarChart3, LogOut } from 'lucide-react';
import { useEffect, useState } from "react";
import commentApi from "../api/commentApi.js";
import postApi from "../api/postApi.js";

export default function AdminDashboard() {
    const [postCount, setPostCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const pageService = usePageService();
    const post = postApi();
    const comment = commentApi();

    const getPostCount = async () => {
        try {
            const getPostCount = await post.postCount();
            setPostCount(getPostCount);
        } catch (error){
            console.error("게시글 수 불러오기 에러", error);
        }
    };

    const getCommentCount = async() => {
        try {
            const getCommentCount = await comment.commentCount();
            setCommentCount(getCommentCount);
        } catch (error){
            console.error("댓글 수 불러오기 에러", error);
        }
    }

    useEffect(() => {
        getPostCount();
        getCommentCount();
    },[])

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* 왼쪽 사이드바 */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                {/* 로고 영역 */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Grape className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Admin Panel</h1>
                            <p className="text-xs text-gray-400">Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* 메뉴 목록 */}
                <nav className="flex-1 p-4">
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white transition-colors">
                            <Home className="w-5 h-5" />
                            <span className="font-medium">대시보드</span>
                        </button>
                        <button
                            onClick={pageService.goToPostWrite}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                            <PencilLine className="w-5 h-5" />
                            <span className="font-medium">새 글 작성</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                            <Newspaper className="w-5 h-5" />
                            <span className="font-medium">게시글 관리</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                            <MessageSquareMore className="w-5 h-5" />
                            <span className="font-medium">댓글 관리</span>
                        </button>
                        <button
                            onClick={pageService.goToCategory}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                            <FolderClosed className="w-5 h-5" />
                            <span className="font-medium">카테고리</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                            <BarChart3 className="w-5 h-5" />
                            <span className="font-medium">통계</span>
                        </button>
                    </div>
                </nav>

                {/* 하단 메뉴 */}
                <div className="p-4 border-t border-gray-800">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors mb-2">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">설정</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">로그아웃</span>
                    </button>
                </div>
            </aside>

            {/* 메인 컨텐츠 영역 */}
            <main className="flex-1 overflow-auto">
                {/* 상단 헤더 */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">대시보드</h2>
                            <p className="text-sm text-gray-500 mt-1">오늘도 좋은 하루 되세요, Haemin님!</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                H
                            </div>
                        </div>
                    </div>
                </header>

                {/* 대시보드 컨텐츠 */}
                <div className="p-8">
                    {/* 통계 카드 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">전체 글</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{(postCount ?? 0).toLocaleString()}</p>
                                    <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Newspaper className="w-6 h-6 text-blue-600"/>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">댓글</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{(commentCount ?? 0).toLocaleString()}</p>
                                    <p className="text-xs text-green-600 mt-2">↑ 8% from last month</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <MessageSquareHeart className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">방문자</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">1.2k</p>
                                    <p className="text-xs text-green-600 mt-2">↑ 24% from last month</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <UsersRound className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 빠른 액션 및 최근 글 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 빠른 액션 */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">빠른 작업</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={pageService.goToPostWrite}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors cursor-pointer">
                                        <PencilLine className="w-5 h-5" />
                                        <span className="font-medium">새 글 작성</span>
                                    </button>
                                    <button
                                        onClick={pageService.goToCategory}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer">
                                        <FolderClosed className="w-5 h-5" />
                                        <span className="font-medium">카테고리 관리</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer">
                                        <MessageSquareMore className="w-5 h-5" />
                                        <span className="font-medium">댓글 관리</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 최근 글 */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">최근 작성한 글</h3>
                                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer">
                                        전체보기 →
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-lg">
                                            📌
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">React 최신 기능 정리</p>
                                            <p className="text-sm text-gray-500">2시간 전</p>
                                        </div>
                                        <span className="text-gray-400">→</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                                            📌
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Tailwind CSS 활용 팁</p>
                                            <p className="text-sm text-gray-500">1일 전</p>
                                        </div>
                                        <span className="text-gray-400">→</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-lg">
                                            📌
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">웹 개발 트렌드 2025</p>
                                            <p className="text-sm text-gray-500">3일 전</p>
                                        </div>
                                        <span className="text-gray-400">→</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}