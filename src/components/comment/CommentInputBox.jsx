import { useState } from "react";
import useComment from "../../api/commentApi.js";

export default function CommentInputBox({ postId, parentId = null, onCommentAdded }) {
    const [content, setContent] = useState("");

    const commentApi = useComment()

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        const commentData = {
            postId,
            nickname: "haem",
            content,
            ...(parentId && { parentId }),
        }

        try {
            const response = await commentApi.createComment(commentData);
            console.log("댓글 등록이 완료되었습니다.", response);
            // 입력 필드 초기화
            setContent("");

            // 부모 컴포넌트에 댓글 추가 알림
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error){
            console.error("댓글 작성 오류", error)
        }


    };

    const handleCancel = () => {
        setContent("");
    };

    return (
        <div className="border border-custom-gray1 rounded-lg p-4 bg-custom-white">
            <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                    type="text"
                    value="haem"
                    readOnly
                    disabled
                    className="px-3 py-2
                    text-custom-gray3"
                />
            </div>
            <textarea
                placeholder="댓글을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-custom-gray1 rounded resize-none
                focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3
                text-custom-gray3"
                rows="3"
            />
            <div className="flex justify-end gap-2">
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors cursor-pointer"
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                >
                    등록
                </button>
            </div>
        </div>
    );
}