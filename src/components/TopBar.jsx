import { useState } from "react";
import usePageService from "../commons/hooks/usePageService.js";
import { useDispatch } from "react-redux";
import { logout } from "../api/auth.js";

export default function TopBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pageService = usePageService();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <div className="top-0 z-50 bg-white">
            <div className="mx-auto flex items-center justify-between p-4">
                {/* 로고 */}
                <div className="flex flex-col items-center justify-center cursor-pointer"
                     onClick={pageService.goToHome}>
                    <img src="/logo/logo16.png" className="w-8" alt="logo"/>
                    <span className="text-sm">HaemStory</span>
                </div>

                {/* 데스크톱 메뉴 */}
                <div className="hidden md:flex items-center justify-center space-x-8 text-sm font-bold">
                    <span className="cursor-pointer hover:text-custom-purple">DASHBOARD</span>
                    <span className="cursor-pointer hover:text-custom-purple">POSTS</span>
                    <span className="cursor-pointer hover:text-custom-purple">CATEGORIES</span>
                    <span className="cursor-pointer hover:text-custom-purple">COMMENTS</span>
                </div>

                {/* 데스크톱 로그아웃 */}
                <div className="hidden md:flex">
                    <span className="cursor-pointer hover:text-custom-purple text-sm font-bold" onClick={handleLogout}>
                        Logout
                    </span>
                </div>

                {/* 모바일 햄버거 버튼 */}
                <button
                    className="md:hidden flex flex-col space-y-1"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className="w-6 h-0.5 bg-neutral-900"></span>
                    <span className="w-6 h-0.5 bg-neutral-900"></span>
                    <span className="w-6 h-0.5 bg-neutral-900"></span>
                </button>
            </div>

            {/* 모바일 메뉴 (드롭다운) */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-neutral-200 bg-white">
                    <div className="flex flex-col p-4 space-y-4 text-sm font-bold">
                        <span className="cursor-pointer hover:text-custom-purple py-2">DASHBOARD</span>
                        <span className="cursor-pointer hover:text-custom-purple py-2">POSTS</span>
                        <span className="cursor-pointer hover:text-custom-purple py-2">CATEGORIES</span>
                        <span className="cursor-pointer hover:text-custom-purple py-2">COMMENTS</span>
                        <span className="cursor-pointer hover:text-custom-purple py-2 border-t border-neutral-200 pt-4"
                              onClick={handleLogout}>
                            Logout
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}