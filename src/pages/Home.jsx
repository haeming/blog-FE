import usePageService from "../commons/hooks/usePageService"

export default function Home(){

    const pageService = usePageService();

    return(
        <>
            <div className="min-h-screen bg-neutral-50">
                <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

                    {/* 환영 메시지 */}
                    <div className="bg-custom-white border border-neutral-200 rounded-2xl p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900">
                                    환영합니다, Haemin님 👋
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
                                    <p className="text-3xl font-bold mt-2 text-neutral-900">24</p>
                                </div>
                                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl">
                                    📝
                                </div>
                            </div>
                        </div>

                        <div className="bg-custom-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-neutral-500 text-sm font-medium">댓글</p>
                                    <p className="text-3xl font-bold mt-2 text-neutral-900">156</p>
                                </div>
                                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl">
                                    💬
                                </div>
                            </div>
                        </div>

                        <div className="bg-custom-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-neutral-500 text-sm font-medium">방문자</p>
                                    <p className="text-3xl font-bold mt-2 text-neutral-900">1.2k</p>
                                </div>
                                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl">
                                    👥
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 빠른 액션 버튼 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <button className="bg-custom-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-900 rounded-2xl p-6 transition-all group cursor-pointer">
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✍️</div>
                            <div className="font-semibold text-lg">새 글 작성</div>
                        </button>
                        <button className="bg-custom-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-900 rounded-2xl p-6 transition-all group cursor-pointer"
                            onClick={pageService.goToCategory}>
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📁</div>
                            <div className="font-semibold text-lg">카테고리 관리</div>
                        </button>
                        <button className="bg-custom-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-900 rounded-2xl p-6 transition-all group cursor-pointer">
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💭</div>
                            <div className="font-semibold text-lg">댓글 관리</div>
                        </button>
                    </div>

                    {/* 최근 글 */}
                    <div className="bg-custom-white border border-neutral-200 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900">최근 작성한 글</h2>
                            <button className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors cursor-pointer">
                                전체보기 →
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