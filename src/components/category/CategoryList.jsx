import baseURL from "../../config/apiBaseUrl.js";

export default function CategoryList({categories}){

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
                        <th className="w-1/5">이미지</th>
                        <th className="w-2/5">카테고리명</th>
                        <th className="w-1/5">게시글 수</th>
                        <th className="w-1/5">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((c, index) => (
                        <tr key={index}>
                            <td className="w-1/5">
                                <img
                                    src={`${baseURL}${c.imageUrl}`}
                                />
                            </td>
                            <td className="w-2/5">{c.categoryName}</td>
                            <td className="w-1/5">{c.postCount}</td>
                            <td className="w-1/5 space-x-2">
                                <button className="text-blue-500 hover:underline cursor-pointer">수정</button>
                                <button className="text-red-500 hover:underline cursor-pointer">삭제</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )

}