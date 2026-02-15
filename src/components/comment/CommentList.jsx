import useComment from "../../api/commentApi.js";
import { useEffect, useState } from "react";

export default function CommentList({ postId, refreshTrigger }) {
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const commentApi = useComment();

    const getCommentList = async (postId) => {
        try {
            const response = await commentApi.commentList(postId);
            setComments(response || []);
            console.log(response);
        } catch (error) {
            console.error("댓글 목록 불러오기 에러", error);
        }
    }

    useEffect(() => {
        if (!postId) return;
        getCommentList(postId);
    }, [postId, refreshTrigger]);

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

    const handleEdit = (commentId, currentContent) => {
        setEditingId(commentId);
        setEditContent(currentContent);
    };

    const submitEdit = async (commentId) => {
        if (!editContent.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        try {
            await commentApi.updateComment(commentId, { content: editContent });
            setEditingId(null);
            setEditContent("");
            getCommentList(postId);
        } catch (error) {
            console.error("댓글 수정 에러", error);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent("");
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await commentApi.deleteComment(commentId);
            getCommentList(postId);
        } catch (error) {
            console.error("댓글 삭제 에러", error);
        }
    };

    const handleReply = (commentId) => {
        setReplyingTo(commentId);
        setReplyContent("");
    };

    const submitReply = async (parentId) => {
        if (!replyContent.trim()) {
            alert("답글 내용을 입력해주세요.");
            return;
        }

        try {
            await commentApi.createComment({
                postId: postId,
                parentId: parentId,
                content: replyContent
            });
            setReplyContent("");
            setReplyingTo(null);
            getCommentList(postId);
        } catch (error) {
            console.error("대댓글 등록 에러", error);
        }
    };

    const renderComment = (comment) => {
        // ✅ parentId가 있으면 대댓글
        const isReply = comment.parentId !== null;

        return (
            <div
                key={comment.id}
                className={`flex gap-3 px-2 group hover:bg-gray-50 rounded-lg transition-colors py-2 
                    ${isReply ? 'ml-12 border-l-2 border-blue-300 pl-4 bg-blue-50/30' : ''}`}
            >
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
                            {formatTime(comment.createdAt || comment.timestamp)}
                        </span>
                        {/* ✅ 대댓글 뱃지 */}
                        {isReply && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                답글
                            </span>
                        )}
                    </div>

                    {/* 수정 모드 */}
                    {editingId === comment.id ? (
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
                                    onClick={() => submitEdit(comment.id)}
                                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    저장
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* 말풍선 스타일 */}
                            <div className={`inline-block ${isReply ? 'bg-white' : 'bg-white'} border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm`}>
                                <p className="text-gray-800 text-sm leading-relaxed break-words">
                                    {comment.content}
                                </p>
                            </div>

                            {/* 액션 버튼들 */}
                            <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                                {/* ✅ 대댓글에는 답글 버튼 안 보임 */}
                                {!isReply && (
                                    <button
                                        onClick={() => handleReply(comment.id)}
                                        className="hover:text-blue-600"
                                    >
                                        답글
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEdit(comment.id, comment.content)}
                                    className="hover:text-blue-600"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="hover:text-red-600"
                                >
                                    삭제
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4 py-4">
            {comments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-block p-4 bg-gray-50 rounded-full mb-3">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-gray-400 text-sm">등록된 댓글이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div key={comment.id}>
                            {renderComment(comment)}

                            {/* ✅ 대댓글 입력 폼 */}
                            {replyingTo === comment.id && (
                                <div className="ml-12 mt-3 border-l-2 border-blue-400 pl-4">
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
                                                    submitReply(comment.id);
                                                }
                                            }}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setReplyContent("");
                                                }}
                                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                                            >
                                                취소
                                            </button>
                                            <button
                                                onClick={() => submitReply(comment.id)}
                                                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                            >
                                                답글 등록
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ✅ 대댓글 렌더링 제거 (replies 배열 사용 안 함) */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}