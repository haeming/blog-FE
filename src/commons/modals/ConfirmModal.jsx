import {X} from "lucide-react";

export default function ConfirmModal({
    isOpen,
    title = "알림",
    message = "정말 삭제하시겠습니까?",
    onConfirm,
    onCancel
}){
    if(!isOpen){
        return null;
    }
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white rounded-lg shadow-lg w-[320px] p-5 text-center">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <button onClick={onCancel}>
                            <X className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"/>
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-5">{message}</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            className="px-4 py-1 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                            onClick={onCancel}
                        >
                            취소
                        </button>
                        <button
                            className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                            onClick={onConfirm}
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}