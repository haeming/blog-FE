import { useState } from "react";

export default function CommentItem({
                                        comment,
                                        isReply = false,
                                        onReply,
                                        onEdit,
                                        onDelete,
                                        replyingTo,
                                        replyContent,
                                        setReplyContent,
                                        onSubmitReply,
                                        onCancelReply
                                    }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return '방금 전';
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (!editContent.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }
        onEdit(comment.id, editContent);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditContent(comment.content);
        setIsEditing(false);
    };

    return (
        <div className={`${isReply ? 'ml-12 border-l-2 border-gray-200 pl-4' : ''}`}>
            <div className="flex gap-3 px-2 group hover:bg-gray-50 rounded-lg transition-colors py-2">
                {/* 프로필 이미지 영역 */}
                <div className="flex-shrink-0">
                    <div className={`${isReply ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold`}>
                        {(comment.nickname || "작성자")[0].toUpperCase()}
                    </div>
                </div>

                {/* 메시지 영역 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                            {comment.nickname || "작성자"}
                        </span>
                        <span className="text-xs text-gray-400">
                            {formatTime(comment.createdAt)}
                        </span>
                        {isReply && (
                            <span className="text-xs text-blue-500 font-medium">답글</span>
                        )}
                    </div>

                    {/* 수정 모드 */}
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows="3"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    저장
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* 말풍선 스타일 */}
                            <div className={`inline-block ${isReply ? 'bg-gray-50' : 'bg-white'} border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm`}>
                                <p className="text-gray-800 text-sm leading-relaxed break-words">
                                    {comment.content}
                                </p>
                            </div>

                            {/* 액션 버튼들 */}
                            <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                                {!isReply && (
                                    <button
                                        onClick={() => onReply(comment.id)}
                                        className="hover:text-blue-600 font-medium"
                                    >
                                        답글
                                    </button>
                                )}
                                <button
                                    onClick={handleEdit}
                                    className="hover:text-blue-600"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => onDelete(comment.id)}
                                    className="hover:text-red-600"
                                >
                                    삭제
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 대댓글 입력 폼 */}
            {replyingTo === comment.id && (
                <div className="mt-3 ml-12 border-l-2 border-blue-400 pl-4">
                    <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            <span className="text-xs text-blue-600 font-semibold">
                                {comment.nickname}님에게 답글 작성
                            </span>
                        </div>
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="답글을 입력하세요..."
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                            rows="3"
                            autoFocus
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    onSubmitReply(comment.id);
                                }
                            }}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={onCancelReply}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => onSubmitReply(comment.id)}
                                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                답글 등록
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}