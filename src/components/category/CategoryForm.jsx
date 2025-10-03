import { ImagePlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function CategoryForm({
                                         mode = "create",
                                         initialData = {}, // { categoryName, imageUrl }
                                         onSubmit
                                     }) {
    const fileInputRef = useRef(null);
    const [name, setName] = useState(initialData.categoryName || "");
    const [preview, setPreview] = useState(initialData.imageUrl || null);
    const [file, setFile] = useState(null); // 새 업로드 파일

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setPreview(imageUrl);
            setFile(selectedFile);
        }
    };

    const handleCancel = () => {
        setName("");
        setPreview("")
    }

    useEffect(() => {
        return () => {
            if (file && preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [file, preview]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            categoryName: name,
            imageFile: file, // 새 업로드 파일 (없으면 null)
            imageUrl: file ? preview : initialData.imageUrl,
            // 파일이 없을 경우 → 기존 이미지 그대로 유지
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="shadow-md border border-custom-gray bg-custom-whitegray rounded-lg p-3"
        >
            <div className="max-w-sm mb-3">
                <span className="font-bold text-title">
                    {mode === "create" ? "새 카테고리" : "카테고리 수정"}
                </span>
            </div>

            {/* 카테고리 이름 */}
            <div className="flex flex-col my-3">
                <label className="text-tiny2">카테고리 이름</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 border border-neutral-300 bg-custom-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-custom-purple2"
                    placeholder="카테고리명을 입력하세요"
                />
            </div>

            {/* 이미지 */}
            <div className="flex flex-col">
                <label className="text-tiny2">
                    {mode === "create" ? "이미지 추가" : "이미지 수정"}
                </label>
                {preview ? (
                    <img
                        src={preview}
                        className="w-32 h-32 object-cover cursor-pointer rounded"
                        onClick={handleClick}
                        alt="카테고리 이미지"
                    />
                ) : (
                    <div
                        onClick={handleClick}
                        className="flex flex-col flex-1 border border-dashed border-neutral-300 rounded-lg px-3 py-6 items-center justify-center text-center cursor-pointer"
                    >
                        <ImagePlus className="text-custom-gray2 w-12 h-12 mx-auto" />
                        <div className="text-custom-gray2 mx-auto text-tiny2">
                            업로드할 파일을 선택해주세요
                        </div>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleChange}
                />
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-2 mt-3">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-1 rounded bg-neutral-200 cursor-pointer"
                >
                    취소
                </button>
                <button
                    type="submit"
                    className="px-4 py-1 rounded bg-custom-purple3 text-white cursor-pointer"
                >
                    {mode === "create" ? "등록" : "수정"}
                </button>
            </div>
        </form>
    );
}
