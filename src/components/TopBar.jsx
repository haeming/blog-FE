import usePageService from "../commons/hooks/usePageService.js";

export default function TopBar(){

    const pageService = usePageService();

    return(
        <div className="top-0 z-50">
            <div className="mx-auto flex items-center justify-between p-4">
                <div>
                    <div className="flex flex-col items-center justify-center cursor-pointer" onClick={pageService.goToHome}>
                        <img src="/logo/logo16.png" className="w-15" alt="logo"/>
                        <span>HaemStory</span>
                    </div>
                </div>
            </div>
        </div>
    )
}