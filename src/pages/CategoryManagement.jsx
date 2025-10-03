import { ImagePlus, Plus } from "lucide-react";
import {useEffect, useState} from "react";
import useCategory from "../api/category.js";
import CategoryForm from "../components/category/CategoryForm.jsx";

export default function CategoryManagement(){
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

    const handleCreate = async (data) => {
        try {
            await category.createCategory(data.categoryName);
            await getCategoryCount(); // 등록 후 카운트 갱신
        } catch (err) {
            console.error(err);
        }
    };

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

            <CategoryForm
                mode="create"
                onSubmit={handleCreate}
            />
  
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