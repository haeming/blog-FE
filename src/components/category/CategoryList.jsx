import baseURL from "../../config/apiBaseUrl.js";
import {Image} from "lucide-react";
import useCategory from "../../api/categoryApi.js";
import {useState} from "react";
import ConfirmModal from "../../commons/modals/ConfirmModal.jsx";

export default function CategoryList({categories, categoryData, categoryCount}){

    const category = useCategory();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleModalOpen = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    }

    const handleDelete = async() => {
        try {
            await category.deleteCategory(selectedId);
            await categoryData();
            await categoryCount();
            setIsModalOpen(false);
            console.log("delete시도 id=",selectedId);
        } catch (err){
            console.error("categoryDeleteError:", err)
        }
    }

    if(!categories || categories.length === 0){
        console.log("gg",categories)
        return(
            <>
                <div
                    className="shadow-md border text-center border-custom-gray bg-custom-whitegray rounded-lg mb-10 p-5">
                    <span>등록된 카테고리가 존재하지 않습니다</span>
                </div>
            </>
        )
    }

    return (
        <>
            <div
                className="shadow-md border text-center border-custom-gray bg-custom-whitegray rounded-lg mb-10">
                <table className="w-full text-sm m-3">
                    <thead>
                    <tr>
                        <th className="w-1/10">이미지</th>
                        <th className="w-5/10">카테고리명</th>
                        <th className="w-2/10">게시글 수</th>
                        <th className="w-2/10">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((c, index) => (
                        <tr key={index}>
                            <td className="w-1/10">
                                {c.imageUrl ? (
                                    <img
                                        src={`${baseURL}${c.imageUrl}`}
                                        className="mx-auto block rounded-full w-13 h-13"
                                    />
                                ):(
                                    <Image className="mx-auto block w-13 h-13 text-custom-gray2"/>
                                )}

                            </td>
                            <td className="w-5/10">{c.categoryName}</td>
                            <td className="w-2/10">{c.postCount}</td>
                            <td className="w-2/10 space-x-2">
                                <button className="text-blue-500 hover:underline cursor-pointer">수정</button>
                                <button className="text-red-500 hover:underline cursor-pointer" onClick={() => handleModalOpen(c.id)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title="카테고리 삭제"
                message="정말 이 카테고리를 삭제하시겠습니까?"
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </>
    )

}