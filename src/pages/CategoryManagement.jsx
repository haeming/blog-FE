import { ImagePlus, Plus } from "lucide-react";
import {useEffect, useRef, useState} from "react";
import useCategory from "../api/category.js";

export default function CategoryManagement(){

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [count, setCount] = useState();

    const category = useCategory();

    const getCategoryCount = async() => {
        try {
            const res = await category.categoryCount();
            setCount(res.count ?? 0);
            console.log(res);
        } catch (error){
            console.error(error);
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click();
    }

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if(file){
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    }

    useEffect(() => {
        getCategoryCount();
    }, []);

    useEffect(() => {
        return() => {
            if(preview){
                URL.revokeObjectURL(preview);
            };
        };
    }, [preview]);

    return(
        <>
            <div className="flex items-center justify-between my-5">
                <div className="flex items-center gap-1">
                    <img src="/icons/directory1.png" className="w-12 h-12 text-custom-purple2 inline align-middle"
                         alt="directory"/>
                    <h2 className="text-2xl font-bold">카테고리 관리</h2>
                </div>
                <button className="bg-custom-purple3 cursor-pointer px-2 py-1 rounded-lg
                    text-custom-white text-sm flex items-center gap-1 shadow-sm
                    hover:bg-custom-purple4 hover:scale-101 transform">
                    <Plus className="w-4 h-4"/>
                    <span className="text-custom-white">카테고리 추가</span>
                </button>
            </div>

            <div className="shadow-md border border-custom-gray bg-custom-whitegray rounded-lg p-3">
                <div className="max-w-sm mb-3">
                    <span className="font-bold text-title">새 카테고리</span>
                </div>

                <div className="flex flex-col my-3">
                    <label className="text-tiny2">카테고리 이름</label>
                    <input type="text"
                           className="flex-1 border border-neutral-300 bg-custom-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-custom-purple2"
                           placeholder="카테고리명을 입력하세요"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-tiny2">이미지 추가</label>
                    {preview ? (
                        <img src={preview} className="w-32 h-32 object-cover cursor-pointer" onClick={handleClick}/>
                    ) : (
                        <div onClick={handleClick}
                             className="flex flex-col flex-1 border border-dashed border-neutral-300 rounded-lg px-3 py-6 items-center justify-center text-center cursor-pointer">
                            <ImagePlus className="text-custom-gray2 w-12 h-12 mx-auto"/>
                            <div className="text-custom-gray2 mx-auto text-tiny2">업로드할 파일을 선택해주세요</div>
                        </div>
                    )}

                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleChange}/>
                </div>

                <div className="flex justify-end space-x-2 mt-3">
                    <button className="px-4 py-1 rounded bg-neutral-200 cursor-pointer">취소</button>
                    <button className="px-4 py-1 rounded bg-custom-purple3 text-white cursor-pointer">등록</button>
                </div>
            </div>

            <div className="rounded-lg flex items-center justify-end space-x-2 mt-10">
                <span className="text-sm text-custom-gray2">총 카테고리 개수</span>
                <span className="text-custom-gray3 font-bold">{count}</span>
            </div>

            <div className="shadow-md border border-custom-gray bg-custom-whitegray rounded-lg mb-10">
                <table className="w-full text-sm text-center m-3">
                    <thead>
                    <tr>
                        <th>이미지</th>
                        <th>카테고리명</th>
                        <th>게시글 수</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>이미지</td>
                        <td>JPA</td>
                        <td>5</td>
                    </tr>
                    </tbody>
                </table>
            </div>


        </>
    )
}