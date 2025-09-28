import usePageService from "../commons/hooks/usePageService.js";
import {useDispatch} from "react-redux";
import {logout} from "../api/auth.js";

export default function TopBar(){

    const pageService = usePageService();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    }

    return(
        <div className="top-0 z-50">
            <div className="mx-auto flex items-center justify-between p-4">
                <div className="flex flex-col items-center justify-center cursor-pointer"
                     onClick={pageService.goToHome}>
                    <img src="/logo/logo16.png" className="w-8" alt="logo"/>
                    <span>HaemStory</span>
                </div>
                <div className="flex items-center justify-center space-x-10 text-topmenu font-bold">
                    <span className="cursor-pointer hover:text-custom-purple">DASHBOARD</span>
                    <span className="cursor-pointer hover:text-custom-purple">POSTS</span>
                    <span className="cursor-pointer hover:text-custom-purple">CATEGORIES</span>
                    <span className="cursor-pointer hover:text-custom-purple">COMMENTS</span>
                </div>
                <div className="flex">
                    <span className="cursor-pointer hover:text-custom-purple" onClick={handleLogout}>Logout</span>
                </div>
            </div>
        </div>
    )
}