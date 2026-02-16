import useComment from "../../api/commentApi.js";
import { useEffect, useState } from "react";
import { formatRelativeTime } from "../../commons/utils/dateFormat.js";

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

            const organizedComments = organizeComments(response || []);
            setComments(organizedComments);
            console.log(organizedComments);
        } catch (error) {
            console.error("댓글 목록 불러오기 에러", error);
        }
    }

    const organizeComments = (commentList) => {
        const result = [];

        // 1. 원댓글만 먼저 추가
        commentList.forEach(comment => {
            if (comment.parentId === null) {
                result.push(comment);
            }
        });

        // 2. 각 원댓글 아래에 대댓글 추가
        const finalResult = [];
        result.forEach(parent => {
            finalResult.push(parent);
            const replies = commentList.filter(c => c.parentId === parent.id);
            finalResult.push(...replies);
        });

        return finalResult;
    };

    const linkifyText = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return (
            <>
                {parts.map((part, index) => {
                    if (part.match(urlRegex)) {
                        return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4f46e5', textDecoration: 'underline' }}
                        className="text-indigo-600 hover:text-indigo-800 underline hover:underline-offset-2 transition-colors !important"
                    >
                        {part}
                    </a>
                    );
                    }
                    return <span key={index}>{part}</span>
                })}
            </>
        );
    };

    useEffect(() => {
        if (!postId) return;
        getCommentList(postId);
    }, [postId, refreshTrigger]);

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
        const isReply = comment.parentId !== null;

        return (
            <div
                key={comment.id}
                className={`${isReply ? 'ml-16' : ''}`}
            >
                <div className={`flex gap-3 p-4 rounded-lg transition-all duration-200
                    ${isReply ? 'bg-gray-50/50 hover:bg-gray-100/50' : 'bg-white hover:bg-gray-50'}`}
                >
                    {/* 프로필 이미지 */}
                    <div className="flex-shrink-0">
                        <div className={`${isReply ? 'w-9 h-9' : 'w-11 h-11'} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm`}>
                            <span className={isReply ? 'text-sm' : 'text-base'}>
                                {(comment.nickname || "작성자")[0].toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* 댓글 내용 */}
                    <div className="flex-1 min-w-0">
                        {/* 헤더 */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">
                                {comment.nickname || "작성자"}
                            </span>
                            {isReply && (
                                <span className="px-2 py-0.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded">
                                    답글
                                </span>
                            )}
                            <span className="text-sm text-gray-400">
                                {formatRelativeTime(comment.createdAt)}
                            </span>
                        </div>

                        {/* 수정 모드 */}
                        {editingId === comment.id ? (
                            <div className="space-y-3">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    rows="3"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => submitEdit(comment.id)}
                                        className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                                    >
                                        저장
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* 댓글 내용 - 링크 파싱 적용 */}
                                <div className="text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap break-words">
                                    {linkifyText(comment.content)}
                                </div>

                                {/* 액션 버튼 */}
                                <div className="flex items-center gap-4 text-sm">
                                    {!isReply && (
                                        <button
                                            onClick={() => handleReply(comment.id)}
                                            className="text-gray-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer"
                                        >
                                            답글
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(comment.id, comment.content)}
                                        className="text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
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
                    <div className="mt-3 ml-16">
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                <span className="text-sm font-medium text-indigo-700">
                                    {comment.nickname}님에게 답글
                                </span>
                            </div>
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="답글을 입력하세요..."
                                className="w-full px-4 py-3 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white"
                                rows="3"
                                autoFocus
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        submitReply(comment.id);
                                    }
                                }}
                            />
                            <div className="flex justify-end gap-2 mt-3">
                                <button
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setReplyContent("");
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={() => submitReply(comment.id)}
                                    className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                                >
                                    답글 등록
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-2 py-6">
            {comments.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-gray-500">등록된 댓글이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {comments.map((comment) => renderComment(comment))}
                </div>
            )}
        </div>
    );
}