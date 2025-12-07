import { useState } from "react";

export default function CommentInputBox({ postId, onCommentAdded }) {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        if (!nickname.trim() || !password.trim() || !content.trim()) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        // API 호출 로직 추가 예정
        console.log({ nickname, password, content, postId });

        // 입력 필드 초기화
        setNickname("");
        setPassword("");
        setContent("");

        // 부모 컴포넌트에 댓글 추가 알림
        if (onCommentAdded) {
            onCommentAdded();
        }
    };

    return (
        <div className="border border-custom-gray2 rounded-lg p-4 bg-custom-gray0">
            <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="px-3 py-2 border border-custom-gray2 rounded
                    focus:outline-none focus:ring-1 focus:ring-blue-500
                    text-custom-gray3"
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-3 py-2 border border-custom-gray2 rounded
                    focus:outline-none focus:ring-1 focus:ring-blue-500
                    text-custom-gray3"
                />
            </div>
            <textarea
                placeholder="댓글을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-custom-gray2 rounded resize-none
                focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3
                text-custom-gray3"
                rows="3"
            />
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                >
                    입력
                </button>
            </div>
        </div>
    );
}