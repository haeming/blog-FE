import { ImagePlus, Plus } from "lucide-react";

export default function CategoryManagement(){
    return(
        <>
            <div className="flex items-center justify-between my-5">
                <div className="flex items-center gap-1">
                    <img src="/icons/directory1.png" className="w-12 h-12 text-custom-purple2 inline align-middle" alt="directory"/>
                    <h2 className="text-2xl font-bold">카테고리 관리</h2>
                </div>
                <button className="bg-custom-purple3 cursor-pointer px-2 py-1 rounded-lg 
                    text-custom-white text-sm flex items-center gap-1 shadow-sm 
                    hover:bg-custom-purple4 hover:scale-101 transform">
                    <Plus className="w-4 h-4" />
                    <span className="text-custom-white">카테고리 추가</span>
                </button>
            </div>

            <div className="shadow-sm border-custom-gray2 rounded-lg p-3">
                <div className="max-w-sm mb-3">
                    <span className="font-bold text-title">새 카테고리</span>
                </div>

                <div className="flex flex-col my-3">
                    <label className="text-tiny2">카테고리 이름</label>
                    <input type="text" className="flex-1 border border-neutral-300 bg-custom-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-custom-purple2"
                        placeholder="카테고리명을 입력하세요"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-tiny2">이미지 추가</label>
                    <div type="file" accept="image/*"
                        className="flex flex-col flex-1 border border-dashed border-neutral-300 rounded-lg px-3 py-6 items-center justify-center text-center cursor-pointer">
                        <ImagePlus className="text-custom-gray2 w-12 h-12 mx-auto" />
                        <div className="text-custom-gray2 mx-auto text-tiny2">업로드할 파일을 선택해주세요</div>
                    </div>
                </div>
            </div>

            
        </>
    )
}